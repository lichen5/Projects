class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>>  thsum;
        if(nums.size()<3)  return thsum; 
        stable_sort(nums.begin(), nums.end());
        if(nums[0]+nums[1]+ nums[2]>0 || nums[nums.size()-1]+ nums[nums.size()-2]+ nums[nums.size()-3]<0 ) return thsum; 
        if(nums[0]+nums[1]+ nums[2]==0) return {{nums[0], nums[1], nums[2]}};
        if(nums[nums.size()-1]+nums[nums.size()-2]+nums[nums.size()-3]==0) return {{nums[nums.size()-3], nums[nums.size()-2], nums[nums.size()-1]}}; 
    
       int  hi, lo, temp; 
       for(int i=0; i< nums.size(); i++) {
             lo=i+1; 
             hi=nums.size()-1;
             while(lo<hi) {
             temp= nums[i] + nums[lo]+ nums[hi];
             if(temp==0) {
                thsum.push_back({nums[i], nums[lo], nums[hi]});
                while ( ++lo < nums.size() && nums[lo] == nums[lo-1]) {};
                while ( --hi >=0 &&  nums[hi] == nums[hi+1]) {}; 
                 }
             else if(temp > 0) hi--;
             else if(temp < 0) lo++;
                }
        while (i+1< nums.size() && nums[i+1]==nums[i]) i++;         
               }
      return thsum; 
      }
};