//example URL: https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/customPPSkirt?m-naturalwaist=780&m-waist=800&m-bellyWidth=900&m-lowerHipLine=1000&m-bellyLineDepth=210&m-hipLineDepth=200&m-skirtLength=800&m-hipsbackhalf=550&m-swayback=0&part=pocket&format=production&id=custom_skirt


// Function: addQueryParams(url: string, params: object): string
// This function takes a URL and a JSON object of key-value pairs, joins them as query string parameters, and returns the new URL with the parameters appended.

function addQueryParams(url, params) {
	  const queryParams = Object.entries(params)
		    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		    .join('&');
	  const separator = url.includes('?') ? '&' : '?';
	  return `${url}${separator}${queryParams}`;
}

function addBaseSize(sizes,count){
	let params
	if(sizes.length>0){
		params = sizes.pop();
		console.log(params);
		let id = 'pattern_'+count+'_';

		params['part']='front'
		params['format']='web embed'
		params['id']=id

		const baseURL = 'https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/customPPSkirt';
		const queryURL = addQueryParams(baseURL, params)

		$.ajax({
			url: queryURL,
			type: "GET",
			dataType: 'text',
			success: function(result){
				combineSVGS(result,sizes,count);
			}
		});
	} else {
		updatePattern();
	}		
}

function getPattern(params){

	for (key in params){
		key = 'm-'+key
	}

	params['part']='front'
	params['format']='web embed'
	params['id']='custom_skirt'

	const baseURL = 'https://hw8kq5s8a5.execute-api.us-west-2.amazonaws.com/customPPSkirt';
	const queryURL = addQueryParams(baseURL, params)

	$.ajax({
		url: queryURL,
		type: "GET",
		dataType: 'text',
		success: function(result){
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
	let measurements = 
    {
      "m-lowerHipLine":$('#lowerHipLine').val()*10,
      "m-hipLineDepth":$('#hipLineDepth').val()*10,
      "m-waist":$('#waist').val()*10,
      "m-skirtLength":$('#skirtLength').val()*10,
      "m-bellyLineDepth":$('#bellyLineDepth').val()*10,
      "m-bellyWidth":$('#bellyWidth').val()*10,
      "m-naturalwaist":$('#naturalwaist').val()*10,
      "m-hipsbackhalf":$('#hipsbackhalf').val()*10,
      "m-swayback":$('#swayback').val()*10,
    }
    /*
    let measurements = 
    {
      "m-lowerHipLine": 900,
      "m-hipLineDepth": 200,
      "m-waist": 700,
      "m-naturalwaist":700,
      "m-hipsbackhalf":450,
      "m-swayback":0,                                                
      "m-skirtLength":700,
      "m-bellyLineDepth":100,
      "m-bellyWidth":850
     }*/
	return measurements
}

function updatePattern(){
	let measurements = getMeasurements();
	getPattern(measurements);
}	

function addPattern(svg){
	let id = 'custom_skirt'
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
      "m-lowerHipLine": 1360,
      "m-hipLineDepth": 200,
      "m-waist": 990,
      "m-naturalwaist":990,
      "m-hipsbackhalf":580,
      "m-swayback":0,                                                
      "m-skirtLength":700,
      "m-bellyLineDepth":100,
      "m-bellyWidth":1000,
    }]

  let sizeold =  [
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

/*
$('.downloadPDF').on('click',function(){
	let pdfSize = $(this).attr('attr-size');
	console.log(pdfSize);
	let measurements = getMeasurements();
	getPDFPattern(measurements,pdfSize);
	$('#downloadbuttons').hide();
	$('#downloadinfo').show();
});*/

