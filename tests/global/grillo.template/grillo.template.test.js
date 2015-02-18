QUnit.module('Test template() behaviour');

QUnit.test("template() renders template and data", function( assert ) {
	assert.equal(grillo.template('Hello, {user}', {user: 'World'}), 'Hello, World', "template string was rendered.");
});
QUnit.test("template() renders template with multiple data", function( assert ) {
	assert.equal(grillo.template('Hello, {user} from {place}', {user: 'World', place: 'Benin'}), 'Hello, World from Benin', "template string was rendered.");
});
QUnit.test("template() renders template with data inside object", function( assert ) {
	assert.equal(grillo.template('Hello, {user.name} from {place}', {user: {name: 'World'}, place: 'Benin'}), 'Hello, World from Benin', "template string was rendered.");
});
