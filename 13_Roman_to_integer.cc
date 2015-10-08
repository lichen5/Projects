class Solution {
public:
    int romanToInt(string s) {
    string  str= "MDCLXVI"; 
    vector<int>   sti={1000,500,100,50,10,5,1};
    int sol=0; 
    for(int i=0; i<s.size(); i++) {
        for(int j=0; j< str.size(); j++) {
            if(s[i] == str[j]) {
            if( (j>0 && s[i+1]==str[j-1]) ||(j>1 && s[i+1] == str[j-2]) ) sol -= sti[j];
            else
            sol += sti[j];
        }       
    }
    }
 
    return sol; 

    }
    };