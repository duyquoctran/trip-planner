(function(){
  // Lightweight Supabase auth helper used by the login page and app bootstrap.
  const config = window.__SUPABASE__ || {};
  const supabaseUrl = config.url || '';
  const supabaseAnonKey = config.anonKey || '';
  const createClient = (window.supabase && typeof window.supabase.createClient === 'function')
    ? window.supabase.createClient
    : (typeof window.createClient === 'function' ? window.createClient : null);

  const client = (createClient && supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

  function _log() {
    // noop for now — keep a central place if we want debug
    // console.debug.apply(console, arguments);
  }

  async function signInWithMagicLink(email) {
    if (!client) return { error: { message: 'missing_supabase_client' } };
    _log('signInWithMagicLink', email);
    try {
      const resp = await client.auth.signInWithOtp({ email });
      return resp;
    } catch (err) {
      return { error: err };
    }
  }

  async function signOut() {
    if (!client) return { error: { message: 'missing_supabase_client' } };
    try {
      return await client.auth.signOut();
    } catch (err) {
      return { error: err };
    }
  }

  async function getSession() {
    if (!client) return { data: { session: null } };
    try {
      return await client.auth.getSession();
    } catch (err) {
      return { error: err };
    }
  }

  function onAuthStateChange(cb) {
    if (!client || typeof cb !== 'function') return () => {};
    const { data: sub } = client.auth.onAuthStateChange((event, session) => {
      cb(event, session);
    });
    return () => {
      try { sub.subscription.unsubscribe(); } catch (e) { /* noop */ }
    };
  }

  function getUser() {
    if (!client) return null;
    const s = client.auth.getUser ? client.auth.getUser() : null;
    return s;
  }

  window.auth = {
    client,
    signInWithMagicLink,
    signOut,
    getSession,
    onAuthStateChange,
    getUser,
  };
})();