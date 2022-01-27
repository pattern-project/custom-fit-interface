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
			url: "https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/customPPSkirt",
			type: "POST",
	  		data: JSON.stringify(data),
			dataType: 'text',
			success: function(result){
				result = JSON.parse(result);
				combineSVGS(result,sizes,count);
			}
		});	
	} else {
		updatePattern();
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
		url: "https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/customPPSkirt",
		type: "POST",
  		data: JSON.stringify(data),
		dataType: 'text',
		success: function(result){
			result = JSON.parse(result);
			addPattern(result);
		}
	});	
}

function getPDFPattern(measurement,size){
	console.log(measurement);
	let id = 'pattern_user_';
	let data = {
			measurement,
			id,
			pdf:true
	}
	$.ajax({
		url: "https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/customPPSkirt",
		type: "POST",
  		data: JSON.stringify(data),
		dataType: 'text',
		success: function(result){
			result = JSON.parse(result);
			//$('#pdfpattern').html(result);
			//$('#pdfpattern').html($('#pdfpattern').html());
			generatePDF(result,size);
		}
	});	
}

function generatePDF(result,size){
	let data = {
		'svg':result,
		'format':'pdf',
		'size':size,
		'url':'https://www.pattern-project.com/',
		'design':'Pattern Project Skirt'
	}
	$.ajax({
		url: "https://tiler.freesewing.org/api",
		type: "POST",
  		data: JSON.stringify(data),
  		contentType:"application/json; charset=utf-8",
		success: function(result){
			$('#downloadinfo').hide();
			$('#downloadbuttons').show();
			$('#downloadlink').html('<a href="'+result.link+'">Download PDF Pattern</a>');
			window.open(result.link, '_blank');
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
	let measurements = 
    {
      "lowerHipLine":$('#lowerHipLine').val()*10,
      "hipLineDepth":$('#hipLineDepth').val()*10,
      "waist":$('#waist').val()*10,
      "skirtLength":$('#skirtLength').val()*10,
      "bellyLineDepth":$('#bellyLineDepth').val()*10,
      "bellyWidth":$('#bellyWidth').val()*10,
    }  

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

let sizes = [{
      "lowerHipLine": 900,
      "hipLineDepth": 200,
      "waist": 700,
      "skirtLength":700,
      "bellyLineDepth":100,
      "bellyWidth":850,
    },
    {
      "lowerHipLine": 1020,
      "hipLineDepth": 200,
      "waist": 810,
      "skirtLength":700,
      "bellyLineDepth":100,
      "bellyWidth":920,
    },
    {
      "lowerHipLine": 1160,
      "hipLineDepth": 200,
      "waist": 990,
      "skirtLength":700,
      "bellyLineDepth":100,
      "bellyWidth":1000,
    },
    {
      "lowerHipLine": 1400,
      "hipLineDepth": 250,
      "waist": 1400,
      "skirtLength":900,
      "bellyLineDepth":150,
      "bellyWidth":1400,
    }];

//let sizes = [];

let transform = {'string':'','x':0,'y':0};
let maxHeight = 0;
$('#downloadinfo').hide();

addBaseSize(sizes,0);
initSliders();

$('.downloadPDF').on('click',function(){
	let pdfSize = $(this).attr('attr-size');
	console.log(pdfSize);
	let measurements = getMeasurements();
	getPDFPattern(measurements,pdfSize);
	$('#downloadbuttons').hide();
	$('#downloadinfo').show();
});