class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
      vector<vector<int>>  result;
      stable_sort(nums.begin(), nums.end()); 
      for(int i=0; i<nums.size(); i++) { 
          for(int j=i+1; j< nums.size(); j++) {
              int k=j+1, l= nums.size()-1; 
              while(k<l) {
              int s=nums[i]+nums[j]+ nums[k]+ nums[l]-target;
              if(s==0){
                  result.push_back({nums[i],nums[j], nums[k],nums[l]});
                  while(++k<nums.size() && nums[k]==nums[k-1]) {}; 
                  while (--l>=0  && nums[l]==nums[l+1]) {}; 
              }
              else if(s>0) l--; 
              else if(s<0) k++; 
              }
           while(j+1< nums.size() && nums[j+1]==nums[j]) j++; 
           
          }
          while( i+1< nums.size() && nums[i+1]==nums[i]) i++; 
      }
      return result; 
    }
};