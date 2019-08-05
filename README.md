# re-az-keyvault

Make calls with the Azure Key Vault REST API.

**Content**

* [Information](#information)
* [Install](#install)
* [Usage](#usage)

## Information

Small and lightweight module to handle calls against the Azure Key Vault REST API.

*Methods in v0.1.0*

* `getCertificate()`
* `getKey()`
* `getSecret()`
* `getSecrets()`
* `listSecrets()`


## Install

```
npm install re-az-keyvault
```

## Usage

Create a `KeyVault` object.

```js
const AZAuthentication = require('re-az-authentication');
const KeyVault = require('re-az-keyvault');

let credentials; 
// Get token response from Azure Rest API. Set environment variables
// CLIENT_ID, CLIENT_SECRET, TENANT_ID or pass then into the method call 
// as parameters. authenticateWithServicePrincipal(clientId, clientSecret, tenantId, {type: keyvault});
// Any authentication method that yields an access token is acceptable, so module
// re-az-authentication is not required.
try {
  credentials = await AZAuthentication.authenticateWithServicePrincipal({type: 'keyvault'});
} catch (error) {
  console.log(error);
}

// With a token response:
let keyvault = new KeyVault(vaultName, credentials);
// It's also possible to just send the token into the constructor, like so:
let keyvault = new KeyVault(vaultName, token);
```

### Methods

#### `getCertificate()`

To get a certificate from the Key Vault:

```js
let certificate;
try {
  certificate = await keyvault.getCertificate(certName);
} catch (error) {
  console.log(error);
}

// To get a specific version.
let certificate;
try {
  certificate = await keyvault.getCertificate(certName, certVersion);
} catch (error) {
  console.log(error);
}

// OR
let certNameAndVersion = 'name/version';
let certificate;
try {
  certificate = await keyvault.getCertificate(certNameAndVersion);
} catch (error) {
  console.log(error);
}
```

#### `getKey()`

To get a key from the Key Vault:

```js
let key;
try {
  key = await keyvault.getKey(keyName);
} catch (error) {
  console.log(error);
}

// To get a specific version.
let key;
try {
  key = await keyvault.getKey(keyName, keyVersion);
} catch (error) {
  console.log(error);
}

// OR
let keyNameAndVersion = 'name/version';
let key;
try {
  key = await keyvault.getKey(keyNameAndVersion);
} catch (error) {
  console.log(error);
}
```

#### `getSecret()`

To get a secret from the Key Vault:

```js
let secret;
try {
  secret = await keyvault.getSecret(secretName);
} catch (error) {
  console.log(error);
}

// To get a specific version.
let secret;
try {
  secret = await keyvault.getSecret(secretName, secretVersion);
} catch (error) {
  console.log(error);
}

// OR
let secretNameAndVersion = 'name/version';
let secret;
try {
  secret = await keyvault.getSecret(secretName, secretVersion);
} catch (error) {
  console.log(error);
}
```

#### `getSecrets()`

To get multiple secrets in parallel:

```js
let secrets;
try {
  secrets = await getSecrets(['name1', 'name2', 'name3']);
} catch (error) {
  console.log(error);
}

// To get specific versions.
let secrets;
try {
  secrets = await getSecrets(['name1/version', 'name2/version', 'name3/version']);
} catch (error) {
  console.log(error);
}
```

#### `listSecrets()`

To list all secrets:

```js
let listedSecrets;
try {
    listedSecrets = await keyvault.listSecrets();
} catch (error) {
  console.log(error);
}
```