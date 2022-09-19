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

app.get('/easy', (req, res) => {
    res.json({title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. \n You may assume that each input would have exactly one solution, and you may not use the same element twice. \n You can return the answer in any order.'});
});

app.get('/medium', (req, res) => {
    res.json({title: 'Add Two Numbers', description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. \n You may assume the two numbers do not contain any leading zero, except the number 0 itself.'});
});

app.get('/hard', (req, res) => {
    res.json({title: 'Median of Two Sorted Arrays', description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. \n The overall run time complexity should be O(log (m+n)).'});
});

const httpServer = createServer(app)

httpServer.listen(8002);
