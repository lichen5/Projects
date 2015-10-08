class Solution {
public:
    string convert(string s, int numRows) {
        if (s.size() <= numRows || numRows==1 ) return s; 
	    string  covs;
	    int np=int(s.size()/(2*numRows-2));
	    for(int i=0; i < numRows; i++){
		   for(int j=0; j<=np;  j++) {
			   int  n1= 2*(numRows-1)*j+i;
			   int  n2= 2*(numRows-1)*(j+1)-i ;
			   if(n1< s.size())  covs.push_back(s[n1]);
			   if(n2< s.size() && i!=0 && i!= numRows-1 )  covs.push_back(s[n2]);  
		   }
	    }
	    
	 
	return  covs ; 
    }
};