class Solution {  
public:  
    bool isMatch(string s, string p) {
        bool dp[s.size() + 1][p.size() + 1];
        dp[0][0] = true;
        for (int i = 1; i <= s.size(); i++)
            dp[i][0] = false;

        for (int j = 1; j <= p.size(); j++)
            dp[0][j] = j > 1 && p[j-1] == '*' && dp[0][j-2];

        for (int i = 0; i < s.size(); i++) {
            for (int j = 0; j < p.size(); j++) {
                if (p[j] != '*') {
                    dp[i+1][j+1] = (p[j] == '.' || s[i] == p[j]) && dp[i][j];        
                } else {
                    dp[i+1][j+1] = j > 0 && dp[i+1][j-1] || dp[i+1][j] || j > 0 && (p[j-1] == '.' || s[i] == p[j-1]) && dp[i][j+1];
                }
            }
        }
        return dp[s.size()][p.size()];
    }
};