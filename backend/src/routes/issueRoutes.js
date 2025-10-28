const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { validateIssue } = require('../middleware/validation');

// Get all issues
router.get('/', issueController.getAllIssues);

// Get issue by ID
router.get('/:id', issueController.getIssueById);

// Create new issue
router.post('/', validateIssue, issueController.createIssue);

// Update issue
router.put('/:id', issueController.updateIssue);

// Delete issue
router.delete('/:id', issueController.deleteIssue);

// Vote on issue
router.post('/:id/vote', issueController.voteOnIssue);

// Validate issue (AI/ML validation)
router.post('/:id/validate', issueController.validateIssue);

module.exports = router;
