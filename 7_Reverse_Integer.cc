class Solution {
public:
    int reverse(int x) {
        if(x == -2147483648 || x== 2147483647 ) return 0; 
        if (x/10==0) return x; 
	    int sign=1 , b,  revint= 0;
	    string rev; 
	    if(x<0) sign=-1; 
	    x= x*sign ; 
	    while(x/10){ 
		  b= x % 10 ;
		  rev.push_back((char)b) ;
		  x /= 10; 
	    }
	    b=x % 10; 
	    rev.push_back((char)b);
	    cout << rev[0] << endl; 
	    if(rev.size()==10 && (int)rev[0] > 2 )  return 0;  
	    
	    for(int i=rev.size()-1; i>0 ; i--){
		    revint+= int(rev[i])*(pow(10, rev.size()-1-i));
	    }	
	    if(rev.size()==10 && (int)rev[0] == 2 ) {
	        if( sign==1 & revint >= 147483647) return 0;
	        if (sign== -1 & revint >=147483648 ) return 0; 
	    }
	    
	    revint += int(rev[0])*(pow(10, rev.size()-1)) ;
	   
	    return sign*revint;  
		     
    }
};