# Unit Testing With QUnit (Guide)!

Unit tests are the basic building blocks for automated tests: each component,
the unit, of software is accompanied by a test that can be run by a test runner
over and over again without any human interaction.
In other words, you can write a test once and run it as often as necessary
without any additional cost.

## Automating Unit Testing

While there are other unit testing frameworks for JavaScript, we've decided to
check out QUnit. QUnit is jQuery's unit test framework and is used by a wide
variety of projects.

To use QUnit, you only need to include two QUnit files on your HTML page.
QUnit consists of `qunit.js`, the test runner and testing framework,
and `qunit.css`, which styles the test suite page to display test results:

```
<!DOCTYPE html>
   <html>
       <head>  
           <meta charset="utf-8">  
           <title>QUnit basic example</title>  
           <link rel="stylesheet" href="//code.jquery.com/qunit/qunit-1.17.1.css">
       </head>
       <body>  
           <div id="qunit"></div>  
           <div id="qunit-fixture"></div>  
           <script src="//code.jquery.com/qunit/qunit-1.17.1.js"></script>  
           <script>
               QUnit.test( "a basic test example", function( assert ) {  
                     var value = "hello";
                     assert.equal( value, "hello", "We expect value to be hello" );
               });  
           </script>
             </body>
  </html>

  ```

  The only markup necessary in the `<body>` element is a `<div>`
  with `id="qunit-fixture"`. This is required for all QUnit tests, even when
  the element itself is empty. This provides the fixture for tests.

  The interesting part is the `<script>` element following the `qunit.js` include.
  It consists of a call to the test function, with two arguments: the name of
  the test as a string, which is later used to display the test results, and a
  function. The function contains the actual testing code, which involves one
  or more assertions. The example uses one assertion, `equal()`.

  Note that there is no `document-ready` block. The test runner handles that:
  calling `QUnit.test()` just adds the test to a queue, and its execution is
  deferred and controlled by the test runner.

### What you see on the browser

The header of the test suite displays the page title, a green bar when all
tests passed (a red bar when at least one test failed), a bar with a few
checkboxes to filter test results and a blue bar with the `navigator.userAgent`
string (handy for screenshots of test results in different browsers).

Of the checkboxes, "Hide passed tests" is useful when a lot of tests ran and
only a few failed. Checking the checkbox will hide everything that passed,
making it easier to focus on the tests that failed.

Checking "Check for Globals" causes QUnit to make a list of all properties on
the `window` object, before and after each test, then checking for differences.
If properties are added or removed, the test will fail, listing the difference.
 This helps to make sure your test code and code under test doesn't accidentally
 export any global properties.

The "No try-catch" checkbox tells QUnit to run your test outside of a try-catch
block. When your test throws an exception, the testrunner will die, unable to
continue running, but you'll get a "native" exception, which can help
tremendously debugging old browsers with bad debugging support like
Internet Explorer 6 (JavaScript sucks at rethrowing exceptions).

Below the header is a summary, showing the total time it took to run all tests
as well as the overall number of total and failed assertions. While tests are
still running, it will show which test is currently being executed.

The actual contents of the page are the test results. Each entry in the
numbered list starts with the name of the test followed by, in parentheses,
the number of failed, passed, and total assertions. Clicking the entry will
show the results of each assertion, usually with details about expected and
actual results. The "Rerun" link at the end will run that test on its own.

#Asserting Results
 ###Problem

Essential elements of any unit test are assertions. You needs to express the
results expected and have the unit testing framework compare them to the
actual values that an implementation produces.

 ###Solution

QUnit provides a number of **built-in assertions**. Let's look at three of those:

**ok( truthy [, message ] )**

The most basic one is `ok()`, which requires just one argument. If the argument
evaluates to true, the assertion passes; otherwise, it fails. In addition, it
accepts a string to display as a message in the test results:

```
QUnit.test( "ok test", function( assert ) {
   assert.ok( true, "true succeeds" );  
   assert.ok( "non-empty", "non-empty string succeeds" );

   assert.ok( false, "false fails" );  
   assert.ok( 0, "0 fails" );  
   assert.ok( NaN, "NaN fails" );  
   assert.ok( "", "empty string fails" );  
   assert.ok( null, "null fails" );  
   assert.ok( undefined, "undefined fails" );
});

```
**equal( actual, expected [, message ] )**

The `equal` assertion uses the simple comparison operator (`==`) to compare the
actual and expected arguments. When they are equal, the assertion passes;
otherwise, it fails. When it fails, both actual and expected values are
displayed in the test result, in addition to a given message:

```
QUnit.test( "equal test", function( assert ) {  
  assert.equal( 0, 0, "Zero, Zero; equal succeeds" );  
  assert.equal( "", 0, "Empty, Zero; equal succeeds" );  
  assert.equal( "", "", "Empty, Empty; equal succeeds" );  
  assert.equal( 0, false, "Zero, false; equal succeeds" );

  assert.equal( "three", 3, "Three, 3; equal fails" );  
  assert.equal( null, false, "null, false; equal fails" );
});

```

Compared to `ok()`, `equal()` makes it much easier to debug tests
that failed, because it's obvious which value caused the test to fail.

When you need a strict comparison (`===`), use `strictEqual()` instead.

**deepEqual( actual, expected [, message ] )**

The `deepEqual()` assertion can be used just like `equal()` and is a
better choice in most cases. Instead of the simple comparison operator (`==`),
it uses the more accurate comparison operator (`===`). That way, undefined
doesn't equal `null`, `0`, or the empty string (`""`). It also compares the content
of objects so that `{key: value}` is equal to `{key: value}`, even when comparing
two objects with distinct identities.

`deepEqual()` also handles `NaN`, dates, regular expressions, arrays,
and functions, while `equal()` would just check the object identity:

```
QUnit.test( "deepEqual test", function( assert ) {  
  var obj = { foo: "bar" };

  assert.deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
});

```

In case you want to explicitly not compare the content of two values, `equal()`
can still be used. In general, `deepEqual()` is the better choice.

#Synchronous Callbacks
 ###Problem

Occasionally, circumstances in your code may prevent callback assertions to
never be called, causing the test to fail silently.

 ###Solution

QUnit provides a special assertion to define the number of assertions a test
contains. When the test completes without the correct number of assertions,
it will fail, no matter what result the other assertions, if any, produced.

Usage is plain and simple; just call `assert.expect()` at the start
of a test, with the number of expected assertions as the only argument:

```
QUnit.test( "a test", function( assert ) {  
  assert.expect( 2 );

  function calc( x, operation ) {
    return operation( x );
  }

    var result = calc( 2, function( x ) {
      assert.ok( true, "calc() calls operation function" );
      return x * x;  
    });

    assert.equal( result, 4, "2 square equals 4" );
});

```
Practical Example:

```
QUnit.test( "a test", function( assert ) {  
  assert.expect( 1 );

  var $body = $( "body" );

  $body.on( "click", function() {
    assert.ok( true, "body was clicked!" );  
  });

  $body.trigger( "click" );
});

```

 ###More

`assert.expect()` provides the most value when actually testing callbacks.
When all code is running in the scope of the test function, `assert.expect()`
provides no additional value—any error preventing assertions to run would cause
the test to fail anyway, because the test runner catches the error and fails
the unit.

#Asynchronous Callbacks
 ###Problem

While `assert.expect()` is useful to test synchronous callbacks, it can fall
short for asynchronous callbacks. Asynchronous callbacks conflict with the way
the test runner queues and executes tests. When code under test starts a
timeout or interval or an AJAX request, the test runner will just continue
running the rest of the test, as well as other tests following it, instead of
waiting for the result of the asynchronous operation.

 ###Solution

For every asynchronous operation in your `QUnit.test()` callback, use
`assert.async()`, which returns a "done" function that should be called when
the operation has completed.

```
QUnit.test( "asynchronous test: async input focus", function( assert ) {  
  var done = assert.async();  
  var input = $( "#test-input" ).focus();  
  setTimeout(function() {
    assert.equal( document.activeElement, input[0], "Input was focused" );
    done();  
  });
});

```

#Testing User Actions
 ###Problem

Code that relies on actions initiated by the user can't be tested by just
calling a function. Usually an anonymous function is bound to an element's
event, e.g., a click, which has to be simulated.

 ###Solution

You can trigger the event using jQuery's `trigger()` method and test that the
expected behavior occurred. If you don't want the native browser events to be
triggered, you can use `triggerHandler()` to just execute the bound event
handlers. This is useful when testing a click event on a link, where
`trigger()` would cause the browser to change the location, which is hardly
desired behavior in a test.

Let's assume we have a simple key logger that we want to test:
```
function KeyLogger( target ) {  
  this.target = target;  
  this.log = [];  

   var that = this;  
   this.target.off( "keydown" ).on( "keydown", function( event ) {
         that.log.push( event.keyCode );  
   });
}

```
We can manually trigger a keypress event to see whether the logger is working:

```
QUnit.test( "keylogger api behavior", function( assert ) {  
  var doc = $( document ),
  keys = new KeyLogger( doc );

  // Trigger the key event  
  doc.trigger( $.Event( "keydown", { keyCode: 9 } ) );

  // Verify expected behavior  
  assert.deepEqual( keys.log, [ 9 ], "correct key was logged" );
});

```

 ###More

If your event handler doesn't rely on any specific properties of the event,
you can just call `.trigger( eventType )`. However, if your event handler does
rely on specific properties of the event, you will need to create an event
object using `$.Event` with the necessary properties, as shown previously.

It's also important to trigger all relevant events for complex behaviors such
as dragging, which is comprised of mousedown, at least one mousemove, and a
mouseup. Keep in mind that even some events that seem simple are actually
compound; e.g., a click is really a mousedown, mouseup, and then click.
Whether you actually need to trigger all three of these depends on the code
under test. Triggering a click works for most cases.

#Keeping Tests Atomic
 ###Problem

When tests are lumped together, it's possible to have tests that should pass
but fail or tests that should fail but pass. This is a result of a test having
invalid results because of side effects of a previous test:

```
QUnit.test( "2 asserts", function( assert ) {  
  var fixture = $( "#qunit-fixture" );

  fixture.append( "<div>hello!</div>" );  
  assert.equal( $( "div", fixture ).length, 1, "div added successfully!" );

  fixture.append( "<span>hello!</span>" );  
  assert.equal( $( "span", fixture ).length, 1, "span added successfully!" );
});

```
The first `append()` adds a `<div>` that the second `equal()` doesn't take into account.

 ###Solution

Use the `QUnit.test()` method to keep tests atomic, being careful to
keep each assertion clean of any possible side effects. You should only rely
on the fixture markup, inside the `#qunit-fixture` element. Modifying and
relying on anything else can have side effects:

```
QUnit.test( "Appends a div", function( assert ) {  
  var fixture = $( "#qunit-fixture" );

  fixture.append( "<div>hello!</div>" );  
  assert.equal( $( "div", fixture ).length, 1, "div added successfully!" );
});

QUnit.test( "Appends a span", function( assert ) {  
  var fixture = $( "#qunit-fixture" );

  fixture.append("<span>hello!</span>" );  
  assert.equal( $( "span", fixture ).length, 1, "span added successfully!" );
});

```
QUnit will reset the elements inside the `#qunit-fixture` element after each test,
removing any events that may have existed. As long as you use elements only
within this fixture, you don't have to manually clean up after your tests to
keep them atomic.

 ###More

In addition to the `#qunit-fixture` fixture element and the filters, QUnit also
offers a `?noglobals` flag.

Consider the following test:

```
QUnit.test( "global pollution", function( assert ) {  
  window.pollute = true;  
  assert.ok( pollute, "nasty pollution" );
});

```

In a normal test run, this passes as a valid result. Running the `ok()` test
with the **noglobals flag** will cause the test to fail, because QUnit detected
that it polluted the window object.

There is no need to use this flag all the time, but it can be handy to detect
global namespace pollution that may be problematic in combination with
third-party libraries. And it helps to detect bugs in tests caused by
side effects.

#Grouping Tests
 ###Problem

You've split up all of your tests to keep them atomic and free of side effects,
but you want to keep them logically organized and be able to run a specific
group of tests on their own.

 ###Solution

You can use the `QUnit.module()` function to group tests together:

```
QUnit.module( "group a" );
QUnit.test( "a basic test example", function( assert ) {  
  assert.ok( true, "this test is fine" );
});
QUnit.test( "a basic test example 2", function( assert ) {  
  assert.ok( true, "this test is fine" );
});

QUnit.module( "group b" );
QUnit.test( "a basic test example 3", function( assert ) {  
  assert.ok( true, "this test is fine" );
  });
QUnit.test( "a basic test example 4", function( assert ) {  
  assert.ok( true, "this test is fine" );
});

```
All tests that occur after a call to `QUnit.module()` will be grouped into that
module. The test names will all be preceded by the module name in the test
results. You can then use that module name to select tests to run.

 ###More

In addition to grouping tests, `QUnit.module()` can be used to extract common
code from tests within that module. The `QUnit.module()` function takes an
optional second parameter to define functions to run before and after each
test within the module:

```
QUnit.module( "module", {  
  setup: function( assert ) {
    assert.ok( true, "one extra assert per test" );  
  },
  teardown: function( assert ) {
    assert.ok( true, "and one extra assert after each test" );  
  }
});
QUnit.test( "test with setup and teardown", function() {  
    assert.expect( 2 );
});

```

You can specify both setup and teardown properties together, or just one of them.

Calling `QUnit.module()` again without the additional argument will simply
reset any setup/teardown functions defined by another module previously.

#Custom Assertions
 ###Problem

You have several tests that duplicate logic for asserting some expectation.
This repetitive code lessens the readability of your tests and increases the
surface for bugs.

```
QUnit.test( "retrieving object keys", function( assert ) {  
  var objectKeys = keys( { a: 1, b: 2 } );  
  assert.ok( objectKeys.indexOf("a") > -1, "Object keys" );  
  assert.ok( objectKeys.indexOf("b") > -1, "Object keys" );

  var arrayKeys = keys( [1, 2] );  
  assert.ok( arrayKeys.indexOf("1") > -1, "Array keys" );  
  assert.ok( arrayKeys.indexOf("2") > -1, "Array keys" );
});

```

 ###Solution

Define a function to encapsulate the expectation in a reusable unit.
Invoke `QUnit.push` within the body to notify QUnit that an assertion
has taken place.

```
QUnit.assert.contains = function( needle, haystack, message ) {  
  var actual = haystack.indexOf(needle) > -1;  
  QUnit.push(actual, actual, needle, message);
};
QUnit.test("retrieving object keys", function( assert ) {  
  var objectKeys = keys( { a: 1, b: 2 } );  
  assert.contains( "a", objectKeys, "Object keys" );  
  assert.contains( "b", objectKeys, "Object keys" );

  var arrayKeys = keys( [1, 2] );  
  assert.contains( "1", arrayKeys, "Array keys" );  
  assert.contains( "2", arrayKeys, "Array keys" );
});

```

 ###More

Custom assertions can help make test suites more readable and more maintainable.
At a minimum, they are simply functions that invoke `QUnit.push` with a Boolean
value--this is how QUnit detects that an assertion has taken place and the
result of that assertion.

It is a good practice to define this function as a method on the global
 `QUnit.assert`object. This helps communicate the purpose of the function to
other developers. You may accomplish this by directly assigning a new property
on the object (i.e.`QUnit.assert.myAssertion = myAssertion;`) or
using `QUnit.extend` (i.e. `QUnit.extend(QUnit.assert, { myAssertion: myAssertion });`).

#Efficient Development
 ###Problem

Once your testsuite takes longer than a few seconds to run, you want to avoid
wasting a lot of time just waiting for test results to come in.

 ###Solution

QUnit has a bunch of features built in to make up for that. The most
interesting ones require just a single click to activate.
Toggle the "Hide passed tests" checkbox at the top, and QUnit will only
show you tests that failed. That alone doesn't make a difference in speed,
but already helps focusing on failing tests.

It gets more interesting if you take another QUnit feature into account,
which is enabled by default and usually not noticable. Whenever a test fails,
QUnit stores the name of that test in `sessionStorage`. The next time you run
a testsuite, that failing test will run before all other tests. The output
order isn't affected, only the execution order. In combination with the
"Hide passed tests" checkbox you will then get to see the failing test,
if it still fails, at the top, as soon as possible.

 ###More

The automatic reordering happens by default. It implies that your tests
need to be atomic, as discussed previously. If your tests aren't, you'll see
random non-deterministic errors. Fixing that is usually the right approach.
If you're really desperate, you can set `QUnit.config.reorder = false`.

In addition to the automatic reordering, there are a few manual options
available. You can rerun any test by clicking the "Rerun" link next to
that test. That will add a `"testNumber=N"` parameter to the query string,
where "N" is the number of the test you clicked. You can then reload the
page to keep running just that test, or use the browser's back button to go
back to running all tests.

Running all tests within a module works pretty much the same way, except that
you choose the module to run using the select at the top right. It'll set a
`"module=N"` query string, where "N" is the encoded name of the module,
for example `"?module=testEnvironment%20with%20object"`.  
