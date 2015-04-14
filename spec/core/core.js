describe("addComponent() behavior", function(){
	it("adds a component", function(){
		grillo.addComponent('dolphin1', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return{
				init:function(){
					// runTest('Dolphin component initialized.');
					console.dir(scope);
					events();
				}
			}
		});
		expect(grillo.comps.dolphin1).toBeDefined();
		expect(grillo.comps.dolphin1).toBeTruthy();
	});

	it("calls the callback initialize function", function(){
		var calledInit = false;
			grillo.addComponent('dolphin2', function(scope){
				var events = function(){
					console.log('Dolphin component events executed.');
				}
				return{
					init:function(){
						console.dir(scope);
						events();
						calledInit = true;
					}
				}
			});

			grillo.init();

			expect(calledInit).toBe(true);
	});

	it("passes in the grillo scope object", function(){
		grillo.addComponent('dolphin3', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
			}
			return{
				init:function(){
					console.dir(scope);
					events();
					expect(scope).toBe(grillo);
				}
			}
		});

		grillo.init();
	});

	it("doesn't override existing component", function(){
		var compFlag = 0;
		grillo.addComponent('dolphin4', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
			}
			return{
				init:function(){
					console.dir(scope);
					events();
					compFlag = 1;
				}
			}
		});
		var addComp = function(){
			grillo.addComponent('dolphin4', function(scope){
				var events = function(){
					console.log('Dolphin component events executed.');
				}
				return{
					init:function(){
						console.dir(scope);
						events();
						compFlag = 2;
					}
				}
			});
		}

		expect(addComp).toThrow();

		grillo.init();

		expect(compFlag).toBe(1);
	});

	it("returns the grillo object", function(){
		var res = grillo.addComponent('dolphin5', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
			}
			return{
				init:function(){
					console.dir(scope);
					events();
				}
			}
		});

		expect(res).toBe(grillo);
	});
});

describe("addUtility() behavior", function(){
	it("adds a utility", function(){

		grillo.addUtility('dolphinUtil1', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
			}
		});
		expect(grillo.utils.dolphinUtil1).toBeDefined();
	});

	it("fires utility function when called", function(){
		var calledBack = false;
		grillo.addUtility('dolphinUtil2', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				calledBack = true;
				events();
			}
		});

		grillo.dolphinUtil2();
		expect(calledBack).toBeTruthy();
	});

	it("passes in the grillo scope object", function(){
		grillo.addUtility('dolphinUtil3', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				expect(scope).toBe(grillo);
				events();
			}
		});

		grillo.dolphinUtil3();
	});

	it("doesn't override existing utility", function(){
		var utilFlag = 0;
		grillo.addUtility('dolphinUtil4', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
				utilFlag = 1;
			}
		});
		var addUtil = function(){
			grillo.addUtility('dolphinUtil4', function(scope){
				var events = function(){
					console.log('Dolphin component events executed.');
					scope.subscribe('testChannel', function(data){
						// runTest('Listener for testChannel in dolphin component executed.');
						// runTest('Dolphin Listener Data received:')
						console.log(data);
					});
				}
				return function(){
					// runTest('Dolphin component initialized.');
					console.dir(scope);
					events();
					utilFlag = 2;
				}
			})
		}
		expect(addUtil).toThrow();
		grillo.dolphinUtil4();
		expect(utilFlag).toBe(1);
	});

	it("provides access to utility function in other utilities and components", function(){
		grillo.addUtility('dolphinUtil5', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
				return "dolphinUtil utility";
			}
		});

		grillo.addUtility('gorillaUtil', function(scope){
			var events = function(){
				console.log('gorilla component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in gorilla component executed.');
					// runTest('gorilla Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('gorilla component initialized.');
				console.dir(scope);
				events();
				expect(scope.dolphinUtil5()).toBe("dolphinUtil utility");
			}
		});

		grillo.addComponent('kiwi', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return{
				init:function(){
					// runTest('Dolphin component initialized.');
					console.dir(scope);
					events();
					expect(scope.dolphinUtil5()).toBe("dolphinUtil utility");
				}
			}
		});

		grillo.init();
		grillo.gorillaUtil();
	});

	it("returns the grillo object", function(){
		var dolph = grillo.addUtility('dolphinUtil6', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
			}
		});

		expect(dolph).toBe(grillo);
	});
});

describe("PubSub functionality", function(){
	beforeEach(function(){
		var listener1 = listener2 = listener3 = {remove:function(){}};
	});
	afterEach(function(){
		listener1.remove();
		listener2.remove();
		listener3.remove();
	});
	describe("subscribers behavior", function(){
		it("gets fired from the global scope", function(){
			listener1 = grillo.subscribe('fireEvent', function(){
				expect(true).toBe(true);
			});

			grillo.publish('fireEvent');
		});

		it("gets fired from components", function(){
			var flg = 0;
			grillo.addComponent('dolphin', function(scope){
				var events = function(){
					console.log('Dolphin component events executed.');
				}
				return{
					init:function(){
						console.dir(scope);
						events();
						listener1 = scope.subscribe('fireEvent', function(){
							expect(true).toBe(true);
							flg++;
						});
					}
				}
			});

			grillo.addUtility('dolphinUtil', function(scope){
				var events = function(){
					console.log('Dolphin component events executed.');
					listener2 = scope.subscribe('fireEvent', function(data){
						// runTest('Listener for testChannel in dolphin component executed.');
						// runTest('Dolphin Listener Data received:')
						console.log(data);
						expect(true).toBe(true);
						flg++;
					});
				};
				return function(){
					// runTest('Dolphin component initialized.');
					console.dir(scope);
					events();
				}
			});

			listener3 = grillo.subscribe('fireEvent', function(){
				expect(true).toBe(true);
				flg++;
			});

			grillo.init();
			grillo.dolphinUtil();

			grillo.publish('fireEvent');
			expect(flg).toBe(3);
		});

		it("gets the passed data object", function(){
			var originalData = {text: "Hi"};
			listener1 = grillo.subscribe('fireEvent', function(data){
				expect(data).toEqual(originalData);
			});

			grillo.publish('fireEvent', originalData);
		});

		it("gets an empty object when there is no data", function(){
			listener1 = grillo.subscribe('fireEvent', function(data){
				console.log(data);
				expect(data).toEqual({});
				expect(data).toBeDefined();
			});

			grillo.publish('fireEvent');
		});

		it("is removed by the remove() function", function(){
			var inListener = false;
			listener1 = grillo.subscribe('fireEvent', function(data){
				console.log(data);
				inListener = true;
			});
			listener1.remove();
			grillo.publish('fireEvent');

			expect(inListener).toBeFalsy();
		});
	});

	describe("publishers behavior", function(){
		it("returns the grillo object", function(){
			listener1 = grillo.subscribe('fireEvent', function(data){
				console.log(data);
			});
			expect(grillo.publish('fireEvent')).toBe(grillo);
		});
	});
});

describe("getAttr() behavior", function(){
	it("returns new namespaced string", function(){
		expect(grillo.getAttr("role")).toBe("data-vc-role");
	});

	it("returns the namespace only when called without argument", function(){
		expect(grillo.getAttr()).toBe("data-vc");
	});

	it("returns the namespaced string with the specified value", function(){
		expect(grillo.getAttr("role", "prev")).toBe("[data-vc-role=prev]");
	});
});

describe("require() behavior", function(){
	it("loads a script", function(done){
		grillo.require('spec/utilities/script.js');
		grillo.subscribe('scriptCalled', function(data){
			expect(data).toBe("I am inside script.js");
			done();
		});
	});

	it("loads multiple scripts in order", function(done){
		var flgStr = '';
		var chkFlgs = function(val){
			flgStr += val;
			if(flgStr === '1235'){
				done();
				console.log('done');
			}
			else{
				console.log(flgStr);
			}
		}
		grillo.require(['spec/utilities/script1.js', 'spec/../js/vendor/script2.js', 'spec/utilities/script3', 'foo']);
		grillo.subscribe('script1Called', function(data){
			expect(data).toBe("I am inside script1.js");
			chkFlgs(1);
		});
		grillo.subscribe('script2Called', function(data){
			expect(data).toBe("I am inside script2.js");
			chkFlgs(2);
		});
		grillo.subscribe('script3Called', function(data){
			expect(data).toBe("I am inside script3.js");
			chkFlgs(3);
		});
		grillo.subscribe('script5Called', function(data){
			expect(data).toBe("I am inside script5.js");
			chkFlgs(5);
		});
	}, 10000);

	it("calls the callback function", function(done){
		grillo.require('foo', function(){
			console.log('called back.');
			expect(true).toBe(true);
			done();
		});
	});

	it("evaluates test function before callback", function(done){
		var flg = 0, total = 3;
		var chkAllAsync = function(){
			if(++flg >= total)done();
		}
		grillo.require('foo', function(){
			expect(true).toBe(true);
			chkAllAsync();
			return true;
		}, function(){
			expect(true).toBe(true);
			chkAllAsync();
		});

		grillo.require('foo', function(){
			expect(true).toBe(true);
			chkAllAsync();
			return false;
		}, function(){
			// shouldn't get called since the test fails
			expect(true).toBe(false);
			chkAllAsync();
		});
	});

	it("calls the success callback", function(done){
		var flg = 0, total = 2;
		var chkAllAsync = function(){
			if(++flg >= total)done();
		}
		grillo.require('spec/utilities/script.js', function(){return typeof ScriptG.text !== 'undefined'}, {
			success: function(){
				expect(true).toBeTruthy();
				chkAllAsync();
			},
			failure: function(){
				expect(true).toBeFalsy();
				chkAllAsync();
			},
			always: function(){
				expect(true).toBeTruthy();
				chkAllAsync();
			}
		});
	});

	it("calls the failure callback", function(done){
		var flg = 0, total = 2;
		var chkAllAsync = function(){
			if(++flg >= total)done();
		}
		grillo.require('spec/utilities/script.js', function(){return typeof ScriptG.text === 'undefined'}, {
			success: function(){
				expect(true).toBeFalsy();
				chkAllAsync();
			},
			failure: function(){
				expect(true).toBeTruthy();
				chkAllAsync();
			},
			always: function(){
				expect(true).toBeTruthy();
				chkAllAsync();
			}
		});
	});
});

describe("Media query object", function(){
	it("should have all the default media queries", function(){
		expect(grillo.mq.xsmall).toBeDefined();
		expect(grillo.mq.small).toBeDefined();
		expect(grillo.mq.medium).toBeDefined();
		expect(grillo.mq.large).toBeDefined();
	});
});
