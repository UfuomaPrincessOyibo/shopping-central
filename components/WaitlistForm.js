'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!email) return;
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      setStatus(error.code === '23505' ? 'already_signed_up' : 'error');
    } else {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <button onClick={handleSubmit}>Join waitlist</button>
      {status === 'success' && <p>You're on the list! ✦</p>}
      {status === 'already_signed_up' && <p>You're already signed up!</p>}
      {status === 'error' && <p>Something went wrong, try again.</p>}
    </div>
  );
}