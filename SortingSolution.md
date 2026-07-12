# Linked List Sorting Solution - Technical Task

## Problem Description
Write pseudocode for a bubble sort algorithm applied to a singly-linked list where sorting is achieved explicitly by swapping the structural nodes rather than altering the internal values.
* **Input Example:** 5 -> 1 -> 12 -> 85 -> 42
* **Output Example:** 1 -> 5 -> 12 -> 42 -> 85

---

### Algorithm Logic (Pseudocode)

```text
ALGORITHM BubbleSortLinkedListBySwappingNodes
INPUT: Head node of a Singly-Linked List
OUTPUT: Head node of the sorted Linked List

1. IF Head is NULL OR Head.next is NULL THEN
       RETURN Head (List is empty or contains only 1 element, already sorted)
   ENDIF

2. Create a temporary "dummy" node.

3. Set dummy.next = Head.

4. Initialize a boolean variable "swapped" to true.

5. WHILE swapped IS true DO
       Set swapped = false
       Set prev = dummy
       Set curr = dummy.next

       WHILE curr IS NOT NULL AND curr.next IS NOT NULL DO
           Set nextNode = curr.next

           // Check if adjacent nodes are out of mathematical order
           IF curr.value > nextNode.value THEN
               
               // Swap the structural node pointers (NOT just internal values)
               curr.next = nextNode.next
               nextNode.next = curr
               prev.next = nextNode

               Set swapped = true
               
               // Update position tracking for the next check loop
               prev = nextNode
           ELSE
               // Advance both traversal pointers forward normally
               prev = curr
               curr = curr.next
           ENDIF
       ENDWHILE
   ENDWHILE

6. RETURN dummy.next (Extract and return the new Head node reference)