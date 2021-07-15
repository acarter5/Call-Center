// note: using a linked-list would be better b/c it'd provide O(1) time-complexity dequeueing... but that's out of the scope of this problem... just pretend this uses a linked list instead of an array

export class Queue<T> {
    // Array is used to implement a Queue
    private items: T[] = []

    isEmpty() {
        return !this.items.length
    }

    enqueue(element: T): void {
        // adding element to the queue
        this.items.push(element)
    }

    dequeue(): string | T {
        // removing element from the queue
        // returns underflow when called
        // on empty queue
        if (this.isEmpty()) return 'Underflow'
        return this.items.shift() as T
    }

    front(): string | T {
        // returns the Front element of
        // the queue without removing it.
        if (this.isEmpty()) return 'No elements in Queue'
        return this.items[0]
    }

    printQueue(): string {
        var str = ''
        for (var i = 0; i < this.items.length; i++) str += this.items[i] + ' '
        return str
    }
}
