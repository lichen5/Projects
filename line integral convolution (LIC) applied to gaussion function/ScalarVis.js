
//University of Illinois/NCSA Open Source License
//Copyright (c) 2015 University of Illinois
//All rights reserved.
//
//Developed by: 		Eric Shaffer
//                  Department of Computer Science
//                  University of Illinois at Urbana Champaign
//
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//documentation files (the "Software"), to deal with the Software without restriction, including without limitation
//the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//disclaimers.Redistributions in binary form must reproduce the above copyright notice, this list
//of conditions and the following disclaimers in the documentation and/or other materials provided with the distribution.
//Neither the names of <Name of Development Group, Name of Institution>, nor the names of its contributors may be
//used to endorse or promote products derived from this Software without specific prior written permission.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//DEALINGS WITH THE SOFTWARE.




//-------------------------------------------------------
// Global variables

var x_extent=[-1.0,1.0];
var y_extent=[-1.0,1.0];
var myGrid;


//------------------------------------------------------
//MAIN
function main() {
	render();
}

//--Function: render-------------------------------------
//Main drawing function

function render(canvas){
  var res = parseFloat(document.getElementById("grid_res").value);
 // document.getElementById("demo").innerHTML = res;
  myGrid = new UGrid2D([x_extent[0],y_extent[0]],  [x_extent[1],y_extent[1]]  ,res);
  var canvas = document.getElementById('example');
  if (! canvas) {
    console.log(' Failed to retrieve the < canvas > element');
    return false;
  }
  else {
	console.log(' Got < canvas > element ');
  }
//########################################################################  
// Get L value 
   var L = parseFloat(document.getElementById("L").value);
    console.log(L); 

//##########################################################################    
    
// Get the rendering context for 2DCG <- (2)
var ctx = canvas.getContext('2d');

// Draw the scalar data using an image rpresentation
var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);


// Set the colormap based in the radio button
var color_func = greyscale_map;
var fval=[]; 

//Color the domain according to the scalar value
for (var x=0;x<canvas.width;x++) {
    fval[x]=[];
	for (var y=0;y<canvas.height;y++)
  	{
  		
        fval[x][y]=Math.random(); 
    
     }
 }
 

//identify the vector field 
var vector_field = gaussian_gradient;


//------------------------------------------------------------
//implement LIC calculation
 for (var x=0; x<canvas.width; x++)
    for (var y=0; y<canvas.height; y++) {
        var fpt=pixel2pt(canvas.width,canvas.height,x_extent,y_extent, x, y);
        var parr=find_points(canvas.width, canvas.height,vector_field, x, y,fpt,L); 
        
        // sum over the points 
        var sum_Ks=0;
        var sum_Nks=0; 
       
        for(var i=0; i< parr.length; i++){ 
           if(parr[i][0] >= 0 &&  parr[i][0]<canvas.width && parr[i][1] >= 0 && parr[i][1] <canvas.height){  
           var fpt_new=pixel2pt(canvas.width,canvas.height,x_extent,y_extent, parr[i][0],parr[i][1]);
           
  		   var Ks=Math.exp(-1.0*(Math.pow((fpt_new[0]-fpt[0]),2) + Math.pow((fpt_new[1]-fpt[1]),2)));
           var NKs=fval[parr[i][0]][parr[i][1]]*Ks;
           sum_Ks += Ks; 
           sum_Nks += NKs; 
           }
        } 
  	             
        var Tp= sum_Nks/sum_Ks; 
  		var color = color_func(Tp,0,1);

  		i = (y*canvas.width + x)*4

  		imgData.data[i]=color[0];
  		imgData.data[i+1]= color[1];
  		imgData.data[i+2]= color[2];
  		imgData.data[i+3]= color[3];  
    }
       ctx.putImageData(imgData,0,0);
       
    //------------------------------------------------------
    
     // Draw the grid if necessary
  if (document.getElementById("show_grid").checked)
    myGrid.draw_grid(canvas);

//-----------------------------------------------------------------------
     //Hedgedog plot at random points
    // Get k value
   var k = parseFloat(document.getElementById("k").value);
    console.log(k);
    if (document.getElementById("hedgehog").checked){ 
       if (document.getElementById("Uniform").checked)
         HedgedogUniform(x_extent, y_extent, res, vector_field, canvas, k); 
       if (document.getElementById("Random").checked) 
        HedgedogRandom(x_extent, y_extent, res, vector_field, canvas, k);
    }
    
    }

//-----------------------------------------------------------------
//find the points used to integration

function find_points(width,height,vector_field, x0, y0, fpt, L) {

        var vn= normalize2D(vector_field(fpt));
        var c=get_case(vn); 
   
        var pt_e=[x0+Math.round(L*vn[0]), y0+Math.round(L*vn[1])];
        var pt_b=[2*x0- pt_e[0], 2*y0-pt_e[1]];
        pt_e=switchToOctant(width, height,c,pt_e[0],pt_e[1]);
        pt_b=switchToOctant(width, height,c,pt_b[0],pt_b[1]);
    
        var dx=pt_e[0]-pt_b[0]; 
        var dy=pt_e[1]-pt_b[1];           
        var D=2*dy- dx;
        var yf=pt_b[1]; 
        var parr=[]; 
    
        parr.push(switchFromOctant(width,height,c, pt_b[0],pt_b[1])); 
    
        for (var xf=pt_b[0]+1; xf<=pt_e[0]; xf++) {
            parr.push(switchFromOctant(width, height,c,xf,yf));
            D=D+(2*dy);
            if(D>0){
                yf=yf+1; 
                D=D-(2*dx); 
            }
        } 
        
    return parr;
} 

//-----------------------------------------------------------------
//put the input in the right region

function get_case(v){ 
    var va0=Math.abs(v[0]);
    var va1=Math.abs(v[1]);
     
    if(v[0]> 0 && v[1]>= 0 && va0>=va1) return 0; 
    if(v[0]> 0 && v[1]> 0 && va0<va1) return 1; 
    if(v[0]<= 0 && v[1]> 0 && va0<=va1) return 2;
    if(v[0]< 0 && v[1]> 0 && va0>va1) return 3;
    if(v[0]< 0 && v[1]<=0 && va0>=va1) return 4;
    if(v[0]< 0 && v[1]< 0 && va0<va1) return 5;
    if(v[0]>=0 && v[1]< 0 && va0<=va1) return 6;
    if(v[0]> 0 && v[1]< 0 && va0>va1) return 7;
    
}
//---------------------------------------------------------------
// switch to  Octant 
function switchToOctant(width, height,c, p_x, p_y) { 
   if(c==0) return [p_x, p_y]; 
   var pt=pixel2pt(width,height,x_extent,y_extent, p_x, p_y); 
   var pt_new=pt;
   if(c==1) pt_new=[pt[1], pt[0]];
   if(c==2) pt_new=[pt[1],-1*pt[0]];
   if(c==3) pt_new=[-1*pt[0],pt[1]];
   if(c==4) pt_new=[-1*pt[0],-1*pt[1]];
   if(c==5) pt_new=[-1*pt[1],-1*pt[0]];
   if(c==6) pt_new=[-1*pt[1],pt[0]];
   if(c==7) pt_new=[pt[0], -1*pt[1]];
   return pt2pixel(width,height,x_extent,y_extent, pt_new[0],pt_new[1]);
}
//-----------------------------------------------------------------
//switch from Octant
function switchFromOctant(width,height,c, p_x, p_y) { 
   if(c==0) return [p_x, p_y];
   var pt=pixel2pt(width,height,x_extent,y_extent, p_x, p_y);
   var pt_new=pt;
   if(c==1) pt_new=[pt[1], pt[0]];
   if(c==2) pt_new=[-1*pt[1],pt[0]];
   if(c==3) pt_new=[-1*pt[0],pt[1]];
   if(c==4) pt_new=[-1*pt[0],-1*pt[1]];
   if(c==5) pt_new=[-1*pt[1],-1*pt[0]];
   if(c==6) pt_new=[pt[1],-1*pt[0]];
   if(c==7) pt_new=[pt[0], -1*pt[1]];
   return pt2pixel(width,height,x_extent,y_extent, pt_new[0],pt_new[1]);
}



//--------------------------------------------------------------
//Uniform hedgehog plot 

function HedgedogUniform(x_extent, y_extent, res, vector_field, canvas,k) {
   var ctx = canvas.getContext('2d');
   var  step= canvas.width/res; 
   for (var ny=0; ny<= res; ny++)           
       for (var nx=0; nx <=res; nx++) {
         var nx_beg= nx*step; 
         var ny_beg= ny*step; 
         var vf= vector_field(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, nx_beg,ny_beg));
         var norm= k*1.0/Math.sqrt(vf[0]*vf[0]+ vf[1]*vf[1]); 
         var nx_end= nx_beg + norm*vf[0];
         var ny_end= ny_beg + norm*vf[1];
           
         drawArrow(nx_beg, ny_beg, nx_end, ny_end, ctx);               
       }
}



//-------------------------------------------------------------
// Random hedgedog plot 


function HedgedogRandom(x_extent, y_extent, res, vector_field, canvas, k) {
    var ctx=canvas.getContext('2d');
   for (var ny=0; ny<= res; ny++)           
       for (var nx=0; nx <=res; nx++) {
         var nx_beg= (Math.random())* canvas.width; 
         var ny_beg= (Math.random())* canvas.height; 
         var vf= vector_field(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, nx_beg,ny_beg));
         var norm= k*1.0/Math.sqrt(vf[0]*vf[0]+ vf[1]*vf[1]); 
         var nx_end= nx_beg + norm*vf[0];
         var ny_end= ny_beg + norm*vf[1];
         drawArrow(nx_beg, ny_beg, nx_end, ny_end, ctx);
       }
}



function drawArrow(fromx, fromy, tox, toy, ctx){
                //variables to be used when creating the arrow
              //  var c = document.getElementById("myCanvas");
         //       var ctx = c.getContext("2d");
                var headlen = 10;

                var angle = Math.atan2(toy-fromy,tox-fromx);

                //starting path of the arrow from the start square to the end square and drawing the stroke
                ctx.beginPath();
                ctx.moveTo(fromx, fromy);
                ctx.lineTo(tox, toy);
                ctx.strokeStyle = "#ff0000";
                ctx.lineWidth = 2;
                ctx.stroke();

                //starting a new path from the head of the arrow to one of the sides of the point
                ctx.beginPath();
                ctx.moveTo(tox, toy);
                ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

                //path from the side point of the arrow, to the other side point
                ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

                //path from the side point back to the tip of the arrow, and then again to the opposite side point
                ctx.lineTo(tox, toy);
                ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

                //draws the paths created above
                ctx.strokeStyle = "#ff0000";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = "#ff0000";
                ctx.fill();
            }


//--------------------------------------------------------
// Map a point in pixel coordinates to the 2D function domain
function pixel2pt(width,height,x_extent,y_extent, p_x,p_y){
	var pt = [0,0];
	xlen=x_extent[1]-x_extent[0]
	ylen=y_extent[1]-y_extent[0]
	pt[0]=(p_x/width)*xlen + x_extent[0];
	pt[1]=(p_y/height)*ylen + y_extent[0];
	return pt;
	}

//--------------------------------------------------------
// Map a point in domain coordinates to pixel coordinates
function pt2pixel(width,height,x_extent,y_extent, p_x,p_y){
	var pt = [0,0];

	var xlen = (p_x-x_extent[0])/(x_extent[1]-x_extent[0]);
  var ylen = (p_y-y_extent[0])/(y_extent[1]-y_extent[0]);

	pt[0]=Math.round(xlen*width);
	pt[1]=Math.round(ylen*height);
	return pt;
	}

function looktable(index) { 
    var e=[]; 
    if(index ==0) e=[]; 
    if(index ==1) e=[2,3]; 
    if(index ==2) e=[1,2];
    if(index ==3) e=[1,3];
    if(index ==4) e=[0,1];
    if(index ==5) e=[0,1,2,3]; 
    if(index ==6) e=[0,2];
    if(index ==7) e=[0,3];
    if(index ==8) e=[0,3];
    if(index ==9) e=[0,2];
    if(index ==10) e=[0,1,2,3];
    if(index ==11) e=[0,1];
    if(index ==12) e=[1,3];
    if(index ==13) e=[1,2];
    if(index ==14) e=[2,3];
    if(index ==15) e=[];
    return  e;
    }
