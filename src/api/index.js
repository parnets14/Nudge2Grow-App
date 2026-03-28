/**
 * API Configuration
 *
 * - Android Emulator  â†’ 10.0.2.2  (maps to your PC's localhost)
 * - Physical Device   â†’ use your PC's WiFi IP (run `ipconfig` to find it)
 *
 * Your current PC IP: 192.168.1.29
 * Change BASE_URL below to match where you're running the app.
 */

// âœ… Use this for Android Emulator:
// export const BASE_URL = 'http://10.0.2.2:5000/api';

// âœ… Physical Device â€” your PC's WiFi IP:
export const BASE_URL = 'http://192.168.1.29:5000/api';

export const fetchIntroSlides = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 8s timeout

  try {
    const res = await fetch(`${BASE_URL}/intro-slides`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[IntroSlides] fetched from API:', data.length, 'slides');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[IntroSlides] fetch error:', err.message);
    throw err;
  }
};

export const fetchGrades = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}/grade`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[Grades] fetched from API:', data.length, 'grades');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Grades] fetch error:', err.message);
    throw err;
  }
};

export const fetchBoards = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}/educational-board`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[Boards] fetched from API:', data.length, 'boards');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Boards] fetch error:', err.message);
    throw err;
  }
};

export const fetchAvatars = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}/avatars`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[Avatars] fetched from API:', data.length, 'avatars');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Avatars] fetch error:', err.message);
    throw err;
  }
};

export const fetchBeyondSchool = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}/customize-learning`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : [];
    // Only life_skill type items
    return items.filter(i => i.type === 'life_skill');
  } catch (err) {
    clearTimeout(timeout);
    console.error('[BeyondSchool] fetch error:', err.message);
    throw err;
  }
};

// â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const sendOTP = async (phone, countryCode) => {
  const res = await fetch(`${BASE_URL}/user/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, countryCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  return data;
};

export const verifyOTP = async (phone, otp) => {
  const res = await fetch(`${BASE_URL}/user/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'OTP verification failed');
  return data; // { token, isNewUser, parent }
};

export const checkEmail = async (token, email) => {
  const res = await fetch(`${BASE_URL}/user/check-email?email=${encodeURIComponent(email)}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Check failed');
  return data; // { registered: bool }
};

export const saveProfile = async (token, email, children) => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email, children }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save profile');
  return data;
};

export const fetchProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data; // full parent object with children
};

export const fetchDidYouKnow = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/did-you-know`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Only active facts, return all â€” app will pick 2
    return (Array.isArray(data) ? data : []).filter(f => f.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[DidYouKnow] fetch error:', err.message);
    throw err;
  }
};

export const fetchRiddles = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/riddles`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter(r => r.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Riddles] fetch error:', err.message);
    throw err;
  }
};

export const fetchParentingInsights = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/parenting-insights`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter(i => i.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[ParentingInsights] fetch error:', err.message);
    throw err;
  }
};

export const fetchPhaseCards = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/phase-cards`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter(c => c.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[PhaseCards] fetch error:', err.message);
    throw err;
  }
};

export const uploadAvatar = async (token, fileUri) => {
  const formData = new FormData();
  formData.append('photo', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  });
  const res = await fetch(`${BASE_URL}/upload/avatar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data; // { url }
};

export const updateChild = async (token, childId, childData) => {
  const res = await fetch(`${BASE_URL}/user/children/${childId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(childData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update child');
  return data;
};

export const updateParentEmail = async (token, email) => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update email');
  return data;
};

export const fetchSubjects = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/learning-subjects/subjects`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Subjects] fetch error:', err.message);
    throw err;
  }
};

export const fetchTopicsBySubject = async (subjectId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/topics`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const topics = Array.isArray(data) ? data : [];
    return subjectId ? topics.filter(t => String(t.subjectId) === String(subjectId)) : topics;
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Topics] fetch error:', err.message);
    return [];
  }
};

export const fetchContentSetByTopic = async (topicId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/content-sets`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const sets = Array.isArray(data) ? data : [];
    return sets.find(s => String(s.topicId) === String(topicId)) || null;
  } catch (err) {
    clearTimeout(timeout);
    console.error('[ContentSet] fetch error:', err.message);
    return null;
  }
};

export const fetchFaqs = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/help-faqs`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter(f => f.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[FAQs] fetch error:', err.message);
    throw err;
  }
};

export const fetchLearnDetailByTopic = async (topicId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/learn-details`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : [];
    return items.find(i => String(i.topicId) === String(topicId)) || null;
  } catch (err) {
    clearTimeout(timeout);
    console.error('[LearnDetail] fetch error:', err.message);
    return null;
  }
};
