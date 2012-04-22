var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('my.peg', 'ascii', function(err, data) {
    // Show the PEG grammar file
    //console.log(data);
    
	// Create my parser
    var parse = PEG.buildParser(data).parse;

	/**
	 * tests
	 */
	
	// Basic Scheem (from pegs4.html)
    assert.deepEqual(
		parse("(+ 1 (* x 3))"),
		["+", "1", ["*", "x", "3"]]
		);
		
	// Another Basic Scheem (also from pegs4.html)
	assert.deepEqual(
		parse("(* n (factorial (- n 1)))"),
		["*", "n", ["factorial", ["-", "n", "1"]]]
		);
		
	// Basic factorial, single white-space
	assert.deepEqual(
		parse("(define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1))))))"),
		["define", "factorial", ["lambda", ["n"], ["if", ["=", "n", "0"], "1", ["*", "n", ["factorial", ["-", "n", "1"]]]]]]
		);
		
	// Scheme factorial, tabs + multiple white-space
	assert.deepEqual(
		parse("(define     factorial\n"
			+ "		(lambda (n)\n"
			+ "			(if (= n 0) 1\n"
			+ "				(* n      (factorial (-      n 1))  ) )))"),
		["define", "factorial", ["lambda", ["n"], ["if", ["=", "n", "0"], "1", ["*", "n", ["factorial", ["-", "n", "1"]]]]]]
		);
		
	// Scheme `quote` short-hand
	assert.deepEqual(
		parse("'(1 2 3 4)"),
		"(quote (1 2 3 4))"
		);
		
	// Comments
	assert.deepEqual(
		parse(";; hello\n"
		+ " (define factorial ("
		+ ";;another comment\n"
		+ " 1 + 2))"),
		["define", "factorial", ["1", "+", "2"]]
		);
	
	console.log("success");
});
