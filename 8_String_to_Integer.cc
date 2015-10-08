public:
    int myAtoi(string str) {
        string str1=""; 
        for(int i=0; i< str.size(); i++ ){
            if(str[i]==' ' || ((int)(str[i]-'0')>=0 && (int)(str[i]-'0') <= 9) || str[i]=='+' || str[i]=='-') {
               
                if(str[i] != ' ') {
                    // cout << "we are here" << endl; 
                    if((str[i]=='+' || str[i]=='-') && str1.size()==0) {
                        cout<<"we are here" << endl; 
                        str1.push_back(str[i]); 
                    }
                    else if( (str[i]=='+' || str[i]=='-') && str1.size()>0) break; 
                    else  str1.push_back(str[i]); 
                }
                else if(str[i] ==' ' &&  str1.size()>0 ) break; 
            }
            else break;
        }
        
        std::cout<< str1[0] << '  '<< (int)(str1[0]-'0')<< std::endl;     
        std::cout<< str1.size()<< std::endl;
        
	    if(str1.size()==0) return 0; 
	    if(str1.size()==1) {
	        if( (int)(str1[0]-'0')>=0 && (int)(str1[0]-'0')<=9 ) return (int)(str1[0]-'0'); 
	        else return 0; 
	    }
	    if(str1.size()==2 && (str1[0] =='+' ||  str1[0] == '-')) {
	              if (str1[0]== '+')  return (int)(str1[1]-'0'); 
	              else return -1*(int)(str1[1]-'0');
	    }

	    if(str1[0]!='-' && str1[0] != '+' && (str1.size()>10 || (str1.size()==10 &&  (int)(str1[0]-'0')> 2))) return 2147483647; 
	    if((str1[0]=='+') && (str1.size()>11 || (str1.size()==11 &&  (int)(str1[1]-'0')> 2))) return 2147483647; 
	    if((str1[0]=='-') && (str1.size()>11 || (str1.size()==11 &&  (int)(str1[1]-'0')> 2))) return -2147483648; 
	    
	    int covint=0; 
	    // for unsigned string 
	    if(str1[0] != '-' && str1[0]!= '+' && str1.size()>=2){
	         for(int i=1; i< str1.size(); i++){ 
		        covint += (int)(str1[i]-'0')*pow(10, str1.size()-1-i);  
	         }
	         
	         if(str1.size() ==10  && str1[0]=='2' && covint>147483647)  return 2147483647; 
		     covint += (int)(str1[0]-'0')*pow(10, str1.size()-1); 
		     return covint; 
         }
         //for signed string
	    
	    if((str1[0] == '-' ||  str1[0] == '+') && str1.size() >= 3 ){ 
		    for(int i=2; i< str1.size(); i++){ 
			    covint += (int)(str1[i]-'0')*pow(10, str1.size()-1-i);  
		    }
		    if(str1.size() ==11 && str1[0]== '-' && str1[1]=='2' && covint>147483648)  return -2147483648; 
		    if(str1.size() ==11 && str1[0]== '+' && str1[1]=='2' && covint>147483647)  return 2147483647;
			covint += (int)(str1[1]-'0')*pow(10, str1.size()-2); 
			if (str1[0]=='-') return  -1*covint;
			if (str1[0]=='+') return  covint; 
		        
		    
	    }
    
    }
};