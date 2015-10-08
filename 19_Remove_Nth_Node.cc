class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
      ListNode*  p1=head;
      ListNode*  p2=head; 
      int count=0; 
      if(p1->next == NULL && n==1) return NULL; 
      if(p1->next == NULL && n==0) return head; 
      while(p1->next != NULL) {
          count++; 
          p1=p1->next;
          if(count>n){ 
             p2=p2->next; 
      }
    }
    if (n>count) return head->next;
    else {
       p2->next= (p2->next)->next; 
       return head;
    }
    }
};