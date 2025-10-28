const supabase = require('../config/supabase');

// Login
exports.login = async (req, res, next) => {
  try {
    const { username, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({
        success: false,
        error: 'Username and role are required',
      });
    }

    // Log login
    const { data, error } = await supabase
      .from('login_logs')
      .insert([{ username, role }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required',
      });
    }

    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'citizen',
        },
      },
    });

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    // Find active login session
    const { data: activeLogins, error: fetchError } = await supabase
      .from('login_logs')
      .select('*')
      .eq('username', username)
      .is('logged_out_at', null)
      .order('timestamp', { ascending: false });

    if (fetchError) throw fetchError;

    if (activeLogins && activeLogins.length > 0) {
      // Update logout timestamp
      const { error: updateError } = await supabase
        .from('login_logs')
        .update({ logged_out_at: new Date().toISOString() })
        .eq('id', activeLogins[0].id);

      if (updateError) throw updateError;
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
