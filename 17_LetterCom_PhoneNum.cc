class Solution {
public:
    vector<string> letterCombinations(string digits) {
        vector<string>  DL={"","", "abc","def", "ghi", "jkl","mno","pqrs","tuv","wxyz"};
        vector<string>  result, temp; 
        for(int i=0; i< digits.size(); i++) {
            int Num=result.size(), DN=digits[i]-48;
            cout <<  digits[i] << DN << endl;
            cout <<  DL[DN].size() << Num <<endl;
            temp=result; 
            result={};
            if(Num){
            for(int j=0;j< DL[DN].size();j++){
                for ( int k=0; k<Num; k++) {
                     cout<< DL[DN][j] << endl; 
                     result.push_back(temp[k]+DL[DN][j]);  
                }
            }
            }
            else {
                for(int j=0; j<DL[DN].size();j++) {
                string s= DL[DN].substr(j,1);
                result.push_back(s);
                }
            } 
        }
        
      return result; 
    }
};