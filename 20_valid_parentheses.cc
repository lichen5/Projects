class Solution {
public:
    bool isValid(string s) {
        if(s.size() % 2 == 1 ) return 0; 
        string sta; 
        int n=s.size();
        sta.push_back(s[0]);
        for(int i=1; i< n ; i++){
            
            if(s[i]== '(' || s[i]=='[' || s[i]=='{') sta.push_back(s[i]);        
            else if(s[i]==')' && sta.back() != '(') return 0; 
            else if(s[i]==']' && sta.back() != '[') return 0; 
            else if(s[i]=='}' && sta.back() != '{') return 0; 
            else sta.pop_back(); 
        }
        if(sta.size()==0) return 1;
        else return 0; 
    }
};