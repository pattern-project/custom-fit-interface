function addBaseSize(sizes,count){
	let measurement
	if(sizes.length>0){
		measurement = sizes.pop();
		console.log(measurement);
		let id = 'pattern_'+count+'_';
		let data = {
				measurement,
				id
		}

		$.ajax({
			url: "https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/briefs",
			type: "POST",
	  		data: JSON.stringify(data),
			dataType: 'text',
			success: function(result){
				result = JSON.parse(result);
				combineSVGS(result,sizes,count);
			}
		});	
	} else {
		//updatePattern();
		console.log('started');
	}		
}

function getPattern(measurement){
	console.log(measurement);
	let id = 'pattern_user_';
	let data = {
			measurement,
			id
	}
	$.ajax({
		url: "https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/briefs",
		type: "POST",
  		data: JSON.stringify(data),
		dataType: 'text',
		success: function(result){
			result = JSON.parse(result);
			addPattern(result);
		}
	});	
}

function combineSVGS(svg,sizes,count){
	let base;
	let id = 'pattern_'+count+'_';
	$('#temppattern').html(svg);
	if(count==0){
		let viewBox = $('#temppattern svg')[0].attributes['viewBox'].value;
		maxHeight = parseFloat(viewBox.split(' ')[2]);
		base = $('#temppattern').html();
		$('#pattern').append(base);
		transform = processTransform($('#pattern_0_part-front').attr('transform'));
	} else {
		let currentTransform = processTransform($('#'+id+'part-front').attr('transform'));
		let transformY = parseFloat(currentTransform.y);
		let translate = 'translate('+transform.x+','+(transformY)+')';

		$('#'+id+'part-front').attr('transform',translate);
		base = $('#temppattern #'+id+'container').html();
		$('#pattern svg').append('<g id="'+id+'container" class="groupscale">'+base+'</g>');	
	}
	$("#pattern").html($("#pattern").html());
	count++
	addBaseSize(sizes,count);
}

function processTransform(transformString){
	let transform = {'string':transformString,'x':0,'y':0};
	let reducedString = transformString.replace('translate(','').replace(')','');
	let transformList = reducedString.split(',');
	transform.x = transformList[0];
	transform.y = transformList[1];
	return transform
}

function initSliders(){
	var sliders = $('.slider');
	sliders.on('input',function() {
		let id = '#'+$(this).attr('id')+'value';
		let value = ($(this).val()) +'cm';
	  	$(id).html(value);
	});
	sliders.each(function(){
		let id = '#'+$(this).attr('id')+'value';
		let value = ($(this).val()) +'cm';
	  	$(id).html(value);
	});
	sliders.on('mouseup',function(){
		updatePattern();
	});
}

function getMeasurements(){
	let measurements = {
		"waistToUpperLeg":$('#waisttoleg').val()*10,
		"upperLeg":$('#upperleg').val()*10,
		"hips":$('#hips').val()*10,
		"waistToHips":$('#waisttohips').val()*10
	}
	$('#copymeasure').val(JSON.stringify(measurements));
	return measurements
}

function updatePattern(){
	let measurements = getMeasurements();
	getPattern(measurements);
}	

function addPattern(svg){
	let id = 'pattern_user_'
	let base = $('#'+id+'container').remove();
	$('#temppattern').html(svg);

	let currentTransform = processTransform($('#'+id+'part-front').attr('transform'));
	let translate = 'translate('+transform.x+','+currentTransform.y+')';


	$('#'+id+'part-front').attr('transform',translate);
	base = $('#temppattern #'+id+'container').html();
	$('#pattern svg').append('<g id="'+id+'container" class="grouppattern">'+base+'</g>');
	$("#pattern").html($("#pattern").html());	

}

let sizes = [
	{
		"waistToUpperLeg":252,
		"upperLeg":525,
		"hips":741,
		"waistToHips":111
	},
	{
		"waistToUpperLeg":296,
		"upperLeg":585,
		"hips":953,
		"waistToHips":130
	}
	,{
		"waistToUpperLeg":350,
		"upperLeg":661,
		"hips":1218,
		"waistToHips":154
	}
]

let transform = {'string':'','x':0,'y':0};
let maxHeight = 0;
$('#tweakmeasures').hide();

addBaseSize(sizes,0);
initSliders();

$('button').on('click',function(){
	updatePattern();
	$('#intialsizing').hide();
	$('#tweakmeasures').show();
});