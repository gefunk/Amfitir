// helper function to get window width
function getWindowWidth(){
	var theWidth;
	if (document.documentElement && document.documentElement.clientWidth) {
		theWidth=document.documentElement.clientWidth;
	}else if (window.innerWidth) {
		theWidth=window.innerWidth;
	}else if (document.body) {
		theWidth=document.body.clientWidth;
	}
	
	return theWidth;
}

function getWindowHeight(){
	var theHeight;
	if (window.innerHeight) {
		theHeight=window.innerHeight;
	}else if (document.documentElement && document.documentElement.clientHeight) {
		theHeight=document.documentElement.clientHeight;
	}else if (document.body) {
		theHeight=document.body.clientHeight;
	}
	return theHeight;
}


function getTransformProperty(element) {
    // Note that in some versions of IE9 it is critical that
    // msTransform appear in this list before MozTransform
    var properties = [
        'transform',
        'WebkitTransform',
        'msTransform',
        'MozTransform',
        'OTransform'
    ];
    var p;
    while (p = properties.shift()) {
        if (typeof element.style[p] != 'undefined') {
            return p;
        }
    }
    return false;
}

function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}
