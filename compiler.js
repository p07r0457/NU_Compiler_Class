var compile = function(expr) {
	var notes = [];
    
	makeNote(notes, true, expr);
    
	return notes;
};


var makeNote = function(notes, nextNote, expr) {
	if (expr.tag === 'note') {
		notes.push({
			tag: 'note',
			pitch: convertPitch(expr.pitch),
			start: endTime(notes, nextNote),
			dur: expr.dur
		});
        	return;
	}
    
	if (expr.tag === 'rest') {
		notes.push({
			tag: 'rest',
			start: endTime(notes, nextNote),
			dur: expr.duration
		});
		return;
	}
    
	if (expr.tag === 'par')
	{
		makeNote(notes, true, expr.left);
		makeNote(notes, false, expr.right);
	}
    
	if (expr.tag === 'seq')
	{
		makeNote(notes, true, expr.left);
		makeNote(notes, true, expr.right);
	}

	if (expr.tag === 'repeat')
		for (var i = 0; i < expr.count; i++) {
			makeNote(notes, true, expr.section);
		}
};


var endTime = function(notes, nextNote) {
	if (notes.length === 0)
		return 0;
    
	var maxTime = 0;
	for (i = 0; i < notes.length; i++) {
		var evalTime;
        
		if (nextNote)
			evalTime = notes[i].start + notes[i].dur;
		else
			evalTime = notes[i].start;
            
		if (evalTime > maxTime)
			maxTime = evalTime;
			
	}
    	
    	return maxTime;
};


var convertPitch = function (pitch) {
	var letter = 0;
	var octive = pitch.substring(1);
	
	switch (pitch.substring(0, 1)) {
		case 'c':
			letter = 0;
			break;
		case 'd':
			letter = 2;
			break;
		case 'e':
			letter = 4;
			break;
		case 'f':
			letter = 5;
			break;
		case 'g':
			letter = 7;
			break;
		case 'a':
			letter = 9;
			break;
		case 'b':
			letter = 11;
			break;
	}
	
	return 12 + (12 * octive) + letter;
};


/**
 * TEST FUNCTIONS
 */
var melody_mus = {
	tag: 'seq',
	left: { tag: 'note', pitch: 'a4', dur: 250 },
	right: {
		tag: 'seq',
		left: { tag: 'note', pitch: 'b4', dur: 250 },
		right: {
			tag: 'seq' ,
			left: { tag: 'rest', duration: 100 },
			right:{
				tag: 'repeat',
				section: {
					tag: 'seq',
					left: { tag: 'note', pitch: 'c4', dur: 250 },
	      			right: {
						tag: 'seq',
	         			left: { tag: 'note', pitch: 'd4', dur: 500 },
	         			right: { tag: 'note', pitch: 'e4', dur: 500 }
					}
				},
				count: 3
			}
		}
	}
};

console.log(melody_mus);
console.log(compile(melody_mus));