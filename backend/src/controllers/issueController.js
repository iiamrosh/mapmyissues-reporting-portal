const supabase = require('../config/supabase');

// Get all issues
exports.getAllIssues = async (req, res, next) => {
  try {
    const { status, priority, department } = req.query;
    let query = supabase.from('issues').select('*');

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (department) query = query.eq('department', department);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Get issue by ID
exports.getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Create new issue
exports.createIssue = async (req, res, next) => {
  try {
    const issueData = req.body;

    // Validate required fields
    const requiredFields = ['type', 'description', 'location', 'latitude', 'longitude'];
    for (const field of requiredFields) {
      if (!issueData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`,
        });
      }
    }

    // Set defaults
    issueData.priority = issueData.priority || 'low';
    issueData.status = issueData.status || 'recent';

    const { data, error } = await supabase
      .from('issues')
      .insert([issueData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Update issue
exports.updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Delete issue
exports.deleteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('issues').delete().eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Issue deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Vote on issue
exports.voteOnIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_name } = req.body;

    if (!user_name) {
      return res.status(400).json({
        success: false,
        error: 'user_name is required',
      });
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('issue_id', id)
      .eq('user_name', user_name)
      .single();

    if (existingVote) {
      return res.status(400).json({
        success: false,
        error: 'User has already voted on this issue',
      });
    }

    // Add vote
    const { data, error } = await supabase
      .from('votes')
      .insert([{ issue_id: id, user_name }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Validate issue (placeholder for AI/ML validation)
exports.validateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch issue
    const { data: issue, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    // Simple validation logic (can be replaced with AI/ML model)
    let isAuthentic = true;
    let confidence = 0.8;
    let category = 'other';

    // Check for spam
    if (!issue.description || issue.description.length < 10 || !issue.photo_url) {
      isAuthentic = false;
      confidence = 0.2;
    } else {
      // Keyword classification
      const descLower = issue.description.toLowerCase();
      if (descLower.includes('pothole')) {
        category = 'pothole';
      } else if (descLower.includes('garbage') || descLower.includes('trash')) {
        category = 'garbage';
      } else if (descLower.includes('light')) {
        category = 'streetlight';
      } else if (descLower.includes('water') || descLower.includes('leak')) {
        category = 'water leakage';
      }
    }

    // Update issue with validation results
    const { data: updatedIssue, error: updateError } = await supabase
      .from('issues')
      .update({ is_authentic: isAuthentic, confidence, category })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      data: {
        issue: updatedIssue,
        validation: { isAuthentic, confidence, category },
      },
    });
  } catch (error) {
    next(error);
  }
};
