// Dependencies loading
const assert = require('assert');

// Use ts-node/register to handle TypeScript imports
require('ts-node/register');

// Import the TypeScript file directly
const { validateUsername } = require('../src/utils/emailUtils');

// Test suite for emailUtils
describe('emailUtils', function() {
  // Test suite for validateUsername function
  describe('validateUsername', function() {
    // Tests for valid usernames
    describe('valid usernames', function() {
      it('should accept simple alphanumeric username', function() {
        const username = 'user123';
        const result = validateUsername(username);
        assert.strictEqual(result, username);
      });

      it('should accept username with allowed special characters', function() {
        const username = 'user.name_test-plus+123';
        const result = validateUsername(username);
        assert.strictEqual(result, username);
      });

      it('should trim leading and trailing whitespace', function() {
        const username = '  username  ';
        const expected = 'username';
        const result = validateUsername(username);
        assert.strictEqual(result, expected);
      });
    });

    // Tests for invalid usernames
    describe('invalid usernames', function() {
      it('should reject empty username', function() {
        assert.throws(() => {
          validateUsername('');
        }, /Username cannot be empty/);

        assert.throws(() => {
          validateUsername('   ');
        }, /Username cannot be empty/);
      });

      it('should reject username with disallowed characters', function() {
        assert.throws(() => {
          validateUsername('user@name');
        }, /Username contains invalid characters/);

        assert.throws(() => {
          validateUsername('user name');
        }, /Username contains invalid characters/);

        assert.throws(() => {
          validateUsername('user#name');
        }, /Username contains invalid characters/);
      });

      it('should reject username without any alphanumeric characters', function() {
        assert.throws(() => {
          validateUsername('._+-');
        }, /Username must contain at least one letter or number/);
      });

      it('should reject username with consecutive dots', function() {
        assert.throws(() => {
          validateUsername('user..name');
        }, /Username cannot contain consecutive dots/);

        assert.throws(() => {
          validateUsername('user...name');
        }, /Username cannot contain consecutive dots/);
      });

      it('should reject username starting with non-alphanumeric characters', function() {
        assert.throws(() => {
          validateUsername('.username');
        }, /Username must start with a letter or number/);

        assert.throws(() => {
          validateUsername('_username');
        }, /Username must start with a letter or number/);

        assert.throws(() => {
          validateUsername('+username');
        }, /Username must start with a letter or number/);

        assert.throws(() => {
          validateUsername('-username');
        }, /Username must start with a letter or number/);
      });

      it('should reject username ending with non-alphanumeric characters', function() {
        assert.throws(() => {
          validateUsername('username.');
        }, /Username must end with a letter or number/);

        assert.throws(() => {
          validateUsername('username_');
        }, /Username must end with a letter or number/);

        assert.throws(() => {
          validateUsername('username+');
        }, /Username must end with a letter or number/);

        assert.throws(() => {
          validateUsername('username-');
        }, /Username must end with a letter or number/);
      });
    });

    // Edge cases
    describe('edge cases', function() {
      it('should accept single character alphanumeric username', function() {
        const username = 'a';
        const result = validateUsername(username);
        assert.strictEqual(result, username);
      });

      it('should accept long username with mixed characters', function() {
        const username = 'very.long_username-with+various123.allowed_characters-that+is.valid';
        const result = validateUsername(username);
        assert.strictEqual(result, username);
      });
    });
  });
});
