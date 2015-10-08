class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target){
    int  diff,s,result;
    int  N=nums.size();
    stable_sort(nums.begin(), nums.end()); 
    cout << nums[0] <<" " << nums[1] << " " << nums[N] << endl;  
    cout << "target is" << target << endl; 
    if( nums[0]+nums[1]+nums[2]> target)   return nums[0]+nums[1]+nums[2];
    if( nums[N-1]+ nums[N-2]+nums[N-3]< target)   return nums[N-1]+nums[N-2]+nums[N-3];
  
    diff=(nums[0]+nums[1] +nums[N-1]- target);
    
    if(target < nums[N-1]) {
    for(int i=0; i< N; i++) { 
       int j=i+1, k=N-1; 
       while(j<k) {
           s= nums[i]+nums[j]+nums[k]-target;
           if(abs(s) == min(abs(diff), abs(s)))  diff=s;
           if(s==0) return target; 
           else if (s>0) k--;
           else if (s<0) j++;
           cout<< "s is" << s<< endl; 
           }
        while(i+1 < N && nums[i]==nums[i+1]) i++;    
    }
    }
    else {
        for(int i=N-1; i>= 0; i--) { 
       int j=0, k=i-1; 
       while(j<k) {
           s= nums[i]+nums[j]+nums[k]-target;
           if(abs(s) == min(abs(diff), abs(s)))  diff=s;
           if(s==0) return target; 
           else if (s>0) k--;
           else if (s<0) j++;
           cout<< "s is" << s<< endl; 
           }
        while(i-1 >= N && nums[i]==nums[i-1]) i--;    
    }
    }
       result=diff+target; 
       return  result; 
    }
};