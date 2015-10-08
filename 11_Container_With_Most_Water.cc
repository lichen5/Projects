class Solution {
public:
    int maxArea(vector<int>& height) {
    if ( height.size() ==0) return 0;    
    cout<< "size is " << height.size() << endl; 
    int MaxA= min(height[0], height[height.size()-1])*(height.size()-1);
    cout << "MaxA" << MaxA << endl; 
    int i=0, j=height.size()-1; 
    int TempArea; 
    while(i<j){
         TempArea= (j-i)*min(height[i], height[j]);
         if (TempArea>MaxA) MaxA = TempArea;  
         if(height[i] <= height[j]) i++;
         else j--; 
    }
     return MaxA; 
      
    }
};