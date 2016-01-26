
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
//  var con = parseFloat(document.getElementById("con_val").value); 
// Get the contour values 
   var conval = document.getElementById("con_val").value; 
   var convalue = conval.split(',');
   var con=[];
   var j=0;
   for( var i=0; i< convalue.length; ++i) {  
    var conj= parseFloat(convalue[i]); 
    if (conj != undefined) {
         con[j]=conj; 
         j++; 
    }
   }
    console.log(con); 
// document.getElementById("demo").innerHTML = con[2];
//##########################################################################    
    
// Get the rendering context for 2DCG <- (2)
var ctx = canvas.getContext('2d');

// Draw the scalar data using an image rpresentation
var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);


// Choose the scalar function
var scalar_func = gaussian;
if (document.getElementById("Sine").checked)
  scalar_func = sin2D;
    

//Determine the data range...useful for the color mapping
var mn = scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,0,0));
var mx = mn; 
for (var y=0;y<canvas.height;y++)
	for (var x=0;x<canvas.width;x++)
  	{
  		var fval = scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,x,y));
  		if (fval < mn)
  			mn=fval;
  		if (fval>mx)
  			mx=fval;
  	}

// Set the colormap based in the radio button
var color_func = rainbow_colormap;
if (document.getElementById("greyscale").checked)
    color_func = greyscale_map;
if (document.getElementById("newmap").checked)  
    color_func = new_colormap; 

//Color the domain according to the scalar value
for (var y=0;y<canvas.height;y++)
	for (var x=0;x<canvas.width;x++)
  	{
  		var fval = scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,x,y));

  		var color = color_func(fval,mn,mx);

  		i = (y*canvas.width + x)*4

  		imgData.data[i]=color[0];
  		imgData.data[i+1]= color[1];
  		imgData.data[i+2]= color[2];
  		imgData.data[i+3]= color[3];
     }

	ctx.putImageData(imgData,0,0);

//##########################################################################################    
 // Draw the contour lines based on the input contour value 
 var step= (canvas.height)/res; 
 var Numcon=con.length; 
 for (var nc=0;  nc < Numcon; nc++)     // loop over different contour value
    for (var ny=0; ny< res; ny++)           
       for (var nx=0; nx < res; nx++) {
         // for each cell get the case table index 
         var index=0; 
         var vt=[[nx*step, ny*step], [(nx+1)*step, ny*step], [(nx+1)*step, (ny+1)*step],[nx*step, (ny+1)*step]];
         for (var i=0; i< 4; i++) { 
             var fval = scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,vt[i][0],vt[i][1])); 
             if( fval >= con[nc] ) index += Math.pow(2, 3-i); 
         }  
         
         // Get the edages intersect with contour line using index  
         var e= looktable(index); 
        
         // connect the intersections 
         
         if(e.length==2) {    // only have two intersections
             var  inset=[];
              for(var i=0; i< 2; i++) { 
                var p1=e[i], p2=e[i]+1; 
                if (p2>3) p2=0; 
                var fval1= scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,vt[p1][0],vt[p1][1]));
                var fval2= scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,vt[p2][0],vt[p2][1]));
                var inset1=((fval1- con[nc])*vt[p2][0] + (con[nc]-fval2)*vt[p1][0])/(fval1-fval2); 
                var inset2=((fval1- con[nc])*vt[p2][1] + (con[nc]-fval2)*vt[p1][1])/(fval1-fval2); 
                inset.push([inset1, inset2]); 
             }     
            // connect the two intersections
             ctx.beginPath();
	  	     ctx.moveTo(inset[0][0],inset[0][1]);
      	     ctx.lineTo(inset[1][0],inset[1][1]);
      	     ctx.lineWidth = 1;
      	     ctx.strokeStyle = '#000000';
      	     ctx.stroke();      
         }
//--------------------------------------------------------------------------------------        
        // take care of the ambiguous case with four intersections
         else if(e.length==4) { 
              var  inset=[];
              var  sum=0; 
              for(var i=0; i< 4; i++) { 
                var p1=e[i], p2=e[i]+1; 
                if (p2>3) p2=0; 
                var fval1= scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,vt[p1][0],vt[p1][1]));
                var fval2= scalar_func(pixel2pt(canvas.width,canvas.height,x_extent,y_extent,vt[p2][0],vt[p2][1]));
                var inset1=((fval1- con[nc])*vt[p2][0] + (con[nc]-fval2)*vt[p1][0])/(fval1-fval2); 
                var inset2=((fval1- con[nc])*vt[p2][1] + (con[nc]-fval2)*vt[p1][1])/(fval1-fval2); 
                sum += fval1;  //s= sum over the vetex values 
                 inset.push([inset1, inset2]); 
             }  
             
             var avg=sum/4.0;  // get the average of the all the vetex values
             var avgID=0;      
             if(avg >= con[nc])  avgID=1;   // if average value >  the contour value, set the avgID as 1.
             if((avgID==1 && index==10) || (avgID==0 && index==5 ) ){ 
             // connect two points 
             ctx.beginPath();
	  	     ctx.moveTo(inset[0][0],inset[0][1]);
      	     ctx.lineTo(inset[1][0],inset[1][1]);
      	     ctx.lineWidth = 1;
      	     ctx.strokeStyle = '#000000';
      	     ctx.stroke(); 
             // connect another two points 
             ctx.beginPath();
	  	     ctx.moveTo(inset[2][0],inset[2][1]);
      	     ctx.lineTo(inset[3][0],inset[3][1]);
      	     ctx.lineWidth = 1;
      	     ctx.strokeStyle = '#000000';
      	     ctx.stroke();  
    
         }
             else{ 
             // connect two points         
             ctx.beginPath();
	  	     ctx.moveTo(inset[0][0],inset[0][1]);
      	     ctx.lineTo(inset[3][0],inset[3][1]);
      	     ctx.lineWidth = 1;
      	     ctx.strokeStyle = '#000000';
      	     ctx.stroke();   
             // connect another two lines        
             ctx.beginPath();
	  	     ctx.moveTo(inset[1][0],inset[1][1]);
      	     ctx.lineTo(inset[2][0],inset[2][1]);
      	     ctx.lineWidth = 1;
      	     ctx.strokeStyle = '#000000';
      	     ctx.stroke();           
           }
             
         }         
        
  }
              
//#########################################################################################                
                

  // Draw the grid if necessary
  if (document.getElementById("show_grid").checked)
    myGrid.draw_grid(canvas);
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
