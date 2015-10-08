class Solution {
public:
	string longestPalindrome(string s) { 
		string maxs=s.substr(0, 1);
		int maxs_size=1; 
		for (int i=0; i<s.size(); i++) {
			int le=i, he=i+1; 
			string tp;
			int tp_size;
			int flag=1;
			// find the even longest palindrome string 
			while( le >= 0 && he < s.size() && flag){
				if(s[le]==s[he]){
					le--;
					he++; 
				}
				else
				    break; 
			    }
			tp=s.substr(le+1,he-le-1);
		    tp_size=tp.size() ;
		    if(tp_size > maxs_size){
				 maxs_size=tp_size;
				 maxs= tp;
				}	
			  
			  // find the odd longest palindrome string 
			  int  lo=i-1, ho=i+1; 
			  while(lo>=0 && ho<s.size()){
				  if(s[lo] == s[ho]){
					  lo--;
					  ho++; 
				  }
  				else  break; 
  			 }	
  			 tp=s.substr(lo+1,ho-lo-1);
  			 tp_size=tp.size() ;
  			 if(tp_size > maxs_size){
  				  maxs_size=tp_size;
  				  maxs= tp;
  				  }	
		}
		return maxs; 		
	}
};
