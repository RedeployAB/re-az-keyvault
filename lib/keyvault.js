'use strict';

const webreq = require('webreq');

/**
 * Class to handle calls against the Azure Key Vault REST API.
 */
class KeyVault {
  constructor(vaultName, credentials) {

    this.credentials = credentials;
    this.baseUri = `https://${vaultName}.vault.azure.net`;
    this.apiVersion = '7.0';

    if (typeof this.credentials === 'object') {
      this.token = credentials.access_token;
    } else {
      this.token = credentials;
    }
  }

  /**
   * Get an Azure Key Vault certificate.
   * If version isn't specified it will fetch the latest version.
   * @param {string} name Name of the certificate that contains the requested value.
   * @param {string} version Version of the certificate that contains the request value.
   * @returns {object} Returns the Key Vault REST API JSON object for a certificate.
   */
  async getCertificate(name, version) {

    let nv = version !== undefined ? `${name}/${version}` : name;
    let uri = this.baseUri + `/certificates/${nv}?api-version=${this.apiVersion}`;

    let certificate;
    try {
      certificate = await _get(uri, this.token);
    } catch (error) {
      throw error;
    }

    return certificate;
  }

  /**
   * Get an Azure Key Vault key.
   * @param {string} name Name of the key that contains the requested value.
   * @param {string} version Version of the key that contains the request value. 
   * @returns {object} Returns the Key Vault REST API JSON object for a key.
   */
  async getKey(name, version) {

    let nv = version !== undefined ? `${name}/${version}` : name;
    let uri = this.baseUri + `/keys/${nv}?api-version=${this.apiVersion}`;

    let key;
    try {
      key = await _get(uri, this.token);
    } catch (error) {
      throw error;
    }

    return key;
  }

  /**
   * Gets an Azure Key Vault secret.
   * @param {string} name Name of the secret that contains the requested value.
   * @param {string} [version] Version of the secret that contains the request value. 
   * @returns {object} Returns the Key Vault REST API JSON object.
   */
  async getSecret(name, version) {

    let nv = version !== undefined ? `${name}/${version}` : name;
    let uri = this.baseUri + `/secrets/${nv}?api-version=${this.apiVersion}`;

    let secret;
    try {
      secret = await _get(uri, this.token);
    } catch (error) {
      throw error;
    }

    return secret;
  }

  /**
   * Get secrets by parallel calls.
   * @param {Array} names Names of secrets to fetch. To get a specific version of a secret,
   * specify name like 'name/version'.
   * @param {object} [options] Object containing options.
   * @param {boolean} [options.secretsObject] If true, it will resolve to an object with
   * secret names as key and secrets as values. Defaults to false.
   * @returns {Promise<Array>|Promise<object>} Resolves to an array of secrets REST API JSON object.
   * If options: { secretsObject: true } is passed it resolves to an object instead containing
   * the secret names as keys and the secrets as the values.
   */
  async getSecrets(names, options) {
    let opts = options ? options : {};

    let secretPromises = [];
    for (let i = 0; i < names.length; i++) {
      let uri = this.baseUri + `/secrets/${names[i]}?api-version=${this.apiVersion}`;
      secretPromises.push(_get(uri, this.token));
    }

    let resolvedSecrets = [].concat.apply([], await _resolvePromises(secretPromises));

    let secrets = [], errors = [];
    resolvedSecrets.forEach((secret) => {
      if (secret.id !== undefined) {
        secrets.push(secret);
      }

      if (secret.error !== undefined) {
        errors.push(secret.error);
      }
    });

    if (errors.length !== 0) {
      throw new Error('One or more secrets could not be fetched.');
    }

    if (opts.secretsObject && opts.secretsObject === true) {
      let secretsObj = {};
      secrets.forEach(secret => {
        let idParts = secret.id.split('/');
        secretsObj[idParts[idParts.length-2]] = secret.value;
      });

      secrets = secretsObj;
    }

    return secrets;
  }

  /**
   * Lists all secrets in the specified vault.
   * @returns {object} Returns the Key Vault REST API JSON object for secret listings.
   */
  async listSecrets() {

    let uri = this.baseUri + `/secrets?api-version=${this.apiVersion}`;

    let secrets;
    try {
      secrets = await _get(uri, this.token);
    } catch (error) {
      throw error;
    }

    return secrets;
  }
}

/**
 * GET request against the Azure Key Vault REST API.
 * @param {string} uri Uri to the requested resource. 
 * @param {string} token Bearer token for the request.
 */
async function _get(uri, token) {

  let options = {
    headers: { Authorization: `Bearer ${token}` }
  };

  let res;
  try {
    res = await webreq.get(uri, options);
    if (res.statusCode !== 200) {
      throw new Error(res.body.error.message);
    }
  } catch (error) {
    throw error;
  }

  return res.body;
}

function _resolvePromises(promises) {
  return Promise.all(
    promises.map(p => p.catch((error) => {
      return { error: { message: error.message } };
    }))
  );
}

module.exports = KeyVault;
