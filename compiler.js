var compile = function(expr) {
	var notes = [];
    
	compileT(notes, true, expr);
    
	return notes;
};


var compileT = function(notes, nextNote, expr) {
	compileNote(notes, nextNote, expr);
	compileRest(notes, nextNote, expr);
    compilePar(notes, nextNote, expr);
	compileSeq(notes, nextNote, expr);
	compileRepeat(notes, nextNote, expr);
};


var compileNote = function(notes, nextNote, expr) {
	if (expr.tag === 'note')
		notes.push({
			tag: 'note',
			pitch: convertPitch(expr.pitch),
			start: endTime(notes, nextNote),
			dur: expr.dur
		});
}


var compileRest = function(notes, nextNote, expr) {
	if (expr.tag === 'rest')
		notes.push({
			tag: 'rest',
			start: endTime(notes, nextNote),
			dur: expr.duration
		});
}


var compilePar = function(notes, nextNote, expr) {
	if (expr.tag !== 'par')
		return;
		
	compileT(notes, nextNote, expr.left);
	compileT(notes, false, expr.right);
}


var compileSeq = function(notes, nextNote, expr) {
	if (expr.tag !== 'seq')
		return;
	compileT(notes, true, expr.left);
	compileT(notes, true, expr.right);
}


var compileRepeat = function(notes, nextNote, expr) {
	if (expr.tag === 'repeat')
		for (var i = 0; i < expr.count; i++) {
			compileT(notes, true, expr.section);
		}
}


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


var convertPitch = function (note) {
	var octive = note[1];
	var pitch = "c d ef g a b".indexOf(note[0]);

	return 12 + (12 * octive) + pitch;
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