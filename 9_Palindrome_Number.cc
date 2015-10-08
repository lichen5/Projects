class Solution {
public:
    bool isPalindrome(int x) {
     if(x<0) return 0; 
     if(x/10==0) return 1; 
     int  Num=0; 
     int y=x; 
     do {
     ++Num;  
     y /= 10;
    } while (y);
   // cout << Num<< endl; 
    
     while(Num>1){
         
        if(x % 10 != x/((int)pow(10, Num-1))) return 0; 
        else if (x % 10 == x/((int)pow(10, Num-1))) { 
              x=x/10; 
              x = x % (int)(pow(10, Num-2));
              Num= Num-2; 
              cout << Num << endl; 
         }
         
     }
      return 1; 
        
    }
};