'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const webreq = require('webreq');
const KeyVault = require('../lib/keyvault');

describe('KeyVault', () => {

  let keyvault = new KeyVault('vault1', { access_token: 'abcdef' });

  describe('class instantiation', () => {

    it('should create an object of type KeyVault through an credential object (token response)', () => {
      expect(keyvault instanceof KeyVault);
    });

    it('should create an object of type KeyVault through a bearer token', () => {
      let keyvault2 = new KeyVault('vault1', 'abcdefg');
      expect(keyvault2 instanceof KeyVault);
    });
  });

  describe('getCertificate()', () => {

    afterEach(() => {
      webreq.get.restore();
    });

    it('should fetch a certificate by name', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getCertificate('cert')
        .then(cert => {
          expect(cert.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should fetch a certificate by name and version', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getCertificate('cert', 'version')
        .then(cert => {
          expect(cert.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should fetch a certificate by name and version from name parameter', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getCertificate('cert/version')
        .then(cert => {
          expect(cert.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should throw if status code is not 200, and return error details', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 403, body: { error: { message: 'No such certificate.' } } });

      return keyvault.getCertificate('cert')
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('No such certificate.');
        });
    });

    it('should throw if call encounters an error', () => {

      sinon.stub(webreq, 'get').rejects(new Error('Connection refused.'));

      return keyvault.getCertificate('cert')
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('Connection refused.')
        });
    });
  });

  describe('getKey()', () => {

    afterEach(() => {
      webreq.get.restore();
    });

    it('should fetch a key by name', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getKey('key')
        .then(key => {
          expect(key.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should fetch a key by name and version', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getKey('key', 'version')
        .then(key => {
          expect(key.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should fetch a key by name and version from name parameter', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getKey('key/version')
        .then(key => {
          expect(key.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should throw if status code is not 200, and return error details', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 403, body: { error: { message: 'No such key.' } } });

      return keyvault.getKey('key')
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('No such key.');
        });
    });

    it('should throw if call encounters an error', () => {

      sinon.stub(webreq, 'get').rejects(new Error('Connection refused.'));

      return keyvault.getKey('key')
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('Connection refused.')
        });
    });
  });

  describe('getSecret()', () => {

    afterEach(() => {
      webreq.get.restore();
    });

    it('should fetch a secret by name', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getSecret('secret')
        .then(key => {
          expect(key.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should fetch a secret by name and version', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getSecret('secret', 'version')
        .then(key => {
          expect(key.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should fetch a secret by name and version from name parameter', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { id: 'id' } });

      return keyvault.getSecret('secret/version')
        .then(key => {
          expect(key.id).to.equal('id');
          sinon.assert.called(webreq.get);
        });
    });

    it('should throw if status code is not 200, and return error details', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 403, body: { error: { message: 'No such secret.' } } });

      return keyvault.getSecret('secret')
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('No such secret.');
        });
    });

    it('should throw if call encounters an error', () => {

      sinon.stub(webreq, 'get').rejects(new Error('Connection refused.'));

      return keyvault.getSecret('secret')
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('Connection refused.')
        });
    });
  });

  describe('getSecrets()', () => {

    afterEach(() => {
      webreq.get.restore();
    });

    it('should fetch all secrets passed in the parameter', () => {

      let getStub = sinon.stub(webreq, 'get');

      getStub.onCall(0).resolves({ statusCode: 200, body: { id: '1', value: '1' } });
      getStub.onCall(1).resolves({ statusCode: 200, body: { id: '2', value: '2' } });
      getStub.onCall(2).resolves({ statusCode: 200, body: { id: '3', value: '3' } });

      return keyvault.getSecrets(['secret1', 'secret2', 'secret3'])
        .then(secrets => {
          expect(secrets.length).to.equal(3);
          expect(secrets[0].id).to.equal('1');
          expect(secrets[0].value).to.equal('1');
          expect(secrets[1].id).to.equal('2');
          expect(secrets[1].value).to.equal('2');
          expect(secrets[2].id).to.equal('3');
          expect(secrets[2].value).to.equal('3');
        });
    });

    it('should throw if one ore more secrets could not be fetched', () => {

      let getStub = sinon.stub(webreq, 'get');

      getStub.onCall(0).resolves({ statusCode: 200, body: { id: '1', value: '1' } });
      getStub.onCall(1).resolves({ statusCode: 403, body: { id: '2', value: '2' } });
      getStub.onCall(2).resolves({ statusCode: 200, body: { id: '3', value: '3' } });

      return keyvault.getSecrets(['secret1', 'secret2', 'secret3'])
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('One or more secrets could not be fetched.');
        });
    });

    it('should throw if one or more calls encountered an error', () => {
      let getStub = sinon.stub(webreq, 'get');

      getStub.onCall(0).rejects(new Error('Connection refused'));
      getStub.onCall(1).rejects(new Error('Connection refused.'));
      getStub.onCall(2).resolves({ statusCode: 200, body: { id: '3', value: '3' } });

      return keyvault.getSecrets(['secret1', 'secret2', 'secret3'])
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('One or more secrets could not be fetched.');
        });
    });
  });

  describe('listSecrets()', () => {

    afterEach(() => {
      webreq.get.restore();
    });

    it('should list all secrets ', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 200, body: { value: [{ id: '1' }, { id: '2' }, { id: '3' }] } });

      return keyvault.listSecrets()
        .then(secrets => {
          expect(secrets.value.length).to.equal(3);
          expect(secrets.value[0].id).to.equal('1');
          expect(secrets.value[1].id).to.equal('2');
          expect(secrets.value[2].id).to.equal('3');
          sinon.assert.called(webreq.get);
        });
    });

    it('should throw if status code is not 200, and return error details', () => {

      sinon.stub(webreq, 'get').resolves({ statusCode: 403, body: { error: { message: 'No secrets.' } } });

      return keyvault.listSecrets()
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('No secrets.');
        });
    });

    it('should throw if call encounters an error', () => {

      sinon.stub(webreq, 'get').rejects(new Error('Connection refused.'));

      return keyvault.listSecrets()
        .then(() => { })
        .catch(err => {
          expect(err.message).to.equal('Connection refused.')
        });
    });

  });

});
