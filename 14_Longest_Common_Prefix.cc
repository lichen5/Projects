class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
       if(strs.size()==0)  return ""; 
       if(strs.size()==1)  return strs[0];
       int flag;
        string cpre= strs[0];
        for(int i=1; i< strs.size(); i++)  { 
            flag=1;
            for(int j=0; j< strs[i].size(); j++) { 
                if(strs[i][j] != cpre[j]) {
                    cpre= cpre.substr(0, j);
                    flag=0;
                    break;
                }
            }
            if(flag) cpre=strs[i];
    }
    return cpre; 
    }
};