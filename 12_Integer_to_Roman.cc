class Solution {
public:
    string intToRoman(int num) {
    string Roman="";
    vector<string> str={ "I","V","X","L","C","D","M"} ; 
    int n1, n2; 
    // 1,5,10, 50, 100, 500, 1000
    for (int i=0; i< 4; i++){
        if (num==0) break;  
        n1= num % 10;
        n2= n1/5 + 1 ; 
        if(n1 == 9 || n1==4) {
            Roman.insert(0,str[2*i+ n2]);
            Roman.insert(0,str[2*i]);
        } else {
            for( int j=0; j< n1 % 5; j++) Roman.insert(0, str[2*i]); 
            if ( n1 >= 5) Roman.insert(0, str[2*i+1]);
        }
        num= num/10;
    }
    return Roman; 
    }
    
};