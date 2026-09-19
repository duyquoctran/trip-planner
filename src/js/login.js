document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const message = document.getElementById('login-message');
  const submitBtn = document.getElementById('login-submit');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = (emailInput.value || '').trim();
    if (!email) {
      message.textContent = 'Please enter a valid email address.';
      return;
    }
    submitBtn.disabled = true;
    message.textContent = 'Sending magic link...';
    try {
      if (!window.auth || typeof window.auth.signInWithMagicLink !== 'function') {
        message.textContent = 'Auth client not ready. Try refreshing the page.';
        submitBtn.disabled = false;
        return;
      }
      const result = await window.auth.signInWithMagicLink(email);
      if (result.error) {
        console.error(result.error);
        message.textContent = result.error.message || 'Failed to send magic link.';
        submitBtn.disabled = false;
        return;
      }
      message.textContent = 'Check your email for the magic link. Follow the link to sign in.';
      emailInput.value = '';
    } catch (err) {
      console.error(err);
      message.textContent = 'Unexpected error. Try again.';
    } finally {
      submitBtn.disabled = false;
    }
  });
});