import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from question-service. hi rui feng');
});

const easys = [
    {title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. \n You may assume that each input would have exactly one solution, and you may not use the same element twice. \n You can return the answer in any order.'},
    {title: 'Palindrome Number', description: 'Given an integer x, return true if x is palindrome integer. \n An integer is a palindrome when it reads the same backward as forward. \n For example, 121 is a palindrome while 123 is not.'},
    {title: 'Longest Common Prefix', description: 'Write a function to find the longest common prefix string amongst an array of strings. \n If there is no common prefix, return an empty string \"\".'}
];

const mediums = [
    {title: 'Add Two Numbers', description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. \n You may assume the two numbers do not contain any leading zero, except the number 0 itself.'},
    {title: 'Longest Palindromic Substring', description: 'Given a string s, return the longest palindromic substring in s. \n A string is called a palindrome string if the reverse of that string is the same as the original string.'},
    {title: 'Reverse Integer', description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0. \n Assume the environment does not allow you to store 64-bit integers (signed or unsigned).'}
];

const hards = [
    {title: 'Median of Two Sorted Arrays', description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. \n The overall run time complexity should be O(log (m+n)).'},
    {title: 'Merge k Sorted Lists', description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. \n Merge all the linked-lists into one sorted linked-list and return it.'},
    {title: 'Reverse Nodes in k-Group', description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. \n k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is. \n You may not alter the values in the list\'s nodes, only nodes themselves may be changed.'}
];

let userToQn = new Map();

/**
 * Gets qn num from userToQn map if user mapping exists, and then deletes all the users' entries for a one time match.
 * @param {*} prefix
 * @param {*} users
 * @returns qnNum
 */
function getQnNum(prefix, users) {
    let qnNum = -1;
    for (var i = 0; i < users.length; i++) {
        if (userToQn.has(prefix + users[i])) {
            qnNum = userToQn.get(prefix + users[i]);
            break;
        }
    }
    if (qnNum !== -1) {
        for (var i = 0; i < users.length; i++) {
            userToQn.delete(prefix + users[i]);
        }
    }
    return qnNum;
}

function setQnNum(prefix, users, qnNum) {
    for (var i = 0; i < users.length; i++) {
        userToQn.set(prefix + users[i], qnNum);
    }
}

/**
 * Get qn num if exists, otherwise sets it with a random qn num
 * @param {*} input
 * @param {*} prefix
 * @param {*} list
 * @returns qn num
 */
function getOrSetQnNum(input, prefix, list) {
    let qnNum = Math.floor(Math.random()*list.length);
    if (input) {
        let mapQnNum = getQnNum(prefix, input);
        if (mapQnNum !== -1) {
            return list[mapQnNum];
        }
    }
    setQnNum(prefix, input, qnNum);
    return list[qnNum];
}

app.post('/easy', (req, res) => {
    const prefix = '/easy';
    res.json(getOrSetQnNum(req.body, prefix, easys));
});

app.post('/medium', (req, res) => {
    const prefix = '/medium';
    res.json(getOrSetQnNum(req.body, prefix, mediums));
});

app.post('/hard', (req, res) => {
    const prefix = '/hard';
    res.json(getOrSetQnNum(req.body, prefix, hards));
});

const httpServer = createServer(app)

httpServer.listen(8002);
