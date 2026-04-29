/**
 * API Configuration - Local Development
 * Mobile app connects to PC's local IP
 */

// For local testing, replace with your PC's local IP
// export const BASE_URL = 'https://nudgebackend.onrender.com/api'

// For production
export const BASE_URL = 'https://nudgebackend.onrender.com/api'

export const fetchIntroSlides = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

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
    // Silently fail - IntroScreen has fallback data
    // console.error('[IntroSlides] fetch error:', err.message);
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
    const res = await fetch(`${BASE_URL}/educational-board`, {
      signal: controller.signal,
    });
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
    const res = await fetch(`${BASE_URL}/avatars`, {
      signal: controller.signal,
    });
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
    const res = await fetch(`${BASE_URL}/customize-learning`, {
      signal: controller.signal,
    });
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

// ── Auth ────────────────────────────────────────────────────────────────────────
export const checkPhone = async (phone, countryCode) => {
  const res = await fetch(`${BASE_URL}/user/check-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, countryCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to check phone');
  return data; // { isRegistered, message }
};

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
  const res = await fetch(
    `${BASE_URL}/user/check-email?email=${encodeURIComponent(email)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Check failed');
  return data; // { registered: bool }
};

export const saveProfile = async (token, email, children) => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, children }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save profile');
  return data;
};

export const fetchProfile = async token => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data; // full parent object with children
};

export const fetchDidYouKnow = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/did-you-know`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Only active facts, return all – app will pick 2
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
    const res = await fetch(`${BASE_URL}/riddles`, {
      signal: controller.signal,
    });
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
    const res = await fetch(`${BASE_URL}/parenting-insights`, {
      signal: controller.signal,
    });
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
    const res = await fetch(`${BASE_URL}/phase-cards`, {
      signal: controller.signal,
    });
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

export const fetchFeaturedContent = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/featured-content/active`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[FeaturedContent] fetch error:', err.message);
    throw err;
  }
};

export const fetchFeaturedContentDetail = async (featuredContentId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/featured-content-detail/${featuredContentId}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      if (res.status === 404) {
        console.log('[FeaturedContentDetail] No detail found for ID:', featuredContentId);
        return null;
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    console.log('[FeaturedContentDetail] fetched successfully');
    return data;
  } catch (err) {
    clearTimeout(timeout);
    console.error('[FeaturedContentDetail] fetch error:', err.message);
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
    headers: { Authorization: `Bearer ${token}` },
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
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
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
    const res = await fetch(`${BASE_URL}/learning-subjects/subjects`, {
      signal: controller.signal,
    });
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

export const fetchTopicsBySubject = async subjectId => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/topics`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const topics = Array.isArray(data) ? data : [];
    return subjectId
      ? topics.filter(t => String(t.subjectId) === String(subjectId))
      : topics;
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Topics] fetch error:', err.message);
    return [];
  }
};

export const fetchContentSetByTopic = async topicId => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/content-sets`, {
      signal: controller.signal,
    });
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
    const res = await fetch(`${BASE_URL}/help-faqs`, {
      signal: controller.signal,
    });
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

export const fetchSubscriptionFaqs = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/subscription/faqs`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[Subscription FAQs] fetched from API:', data.length, 'faqs');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Subscription FAQs] fetch error:', err.message);
    throw err;
  }
};

export const fetchLearnDetailByTopic = async topicId => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/learn-details`, {
      signal: controller.signal,
    });
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

export const sendPhoneChangeOTP = async (token, newPhone, countryCode) => {
  const res = await fetch(`${BASE_URL}/user/change-phone/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPhone, countryCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  return data;
};

export const verifyPhoneChange = async (token, newPhone, countryCode, otp) => {
  const res = await fetch(`${BASE_URL}/user/change-phone/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPhone, countryCode, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Phone verification failed');
  return data;
};

export const updatePhone = async (token, phone, countryCode) => {
  const res = await fetch(`${BASE_URL}/user/update-phone`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phone, countryCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update phone');
  return data;
};

export const deleteChild = async (token, childId) => {
  const res = await fetch(`${BASE_URL}/user/children/${childId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete child');
  return data;
};

export const switchActiveChild = async (token, childId) => {
  const res = await fetch(`${BASE_URL}/user/switch-child`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ childId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to switch child');
  return data;
};

export const addChild = async (token, childData) => {
  const res = await fetch(`${BASE_URL}/user/children`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(childData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add child');
  return data; // { message, child }
};

// ── Testimonials ──────────────────────────────────────────────────────────────
export const fetchTestimonials = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/testimonials`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Testimonials] fetch error:', err.message);
    throw err;
  }
};

// ── Question Types ────────────────────────────────────────────────────────────
export const fetchQuestionTypes = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/question-types`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[QuestionTypes] fetched from API:', data.length, 'types');
    return (Array.isArray(data) ? data : []).filter(q => q.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[QuestionTypes] fetch error:', err.message);
    throw err;
  }
};

// ── Quiz Settings ─────────────────────────────────────────────────────────────
export const fetchQuizSettings = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}/quiz-settings`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[QuizSettings] fetched from API:', data.length, 'settings');
    return (Array.isArray(data) ? data : []).filter(s => s.isActive !== false);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[QuizSettings] fetch error:', err.message);
    throw err;
  }
};

// ── Send Quiz Email ───────────────────────────────────────────────────────────
export const sendQuizEmail = async (quizData) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${BASE_URL}/quiz-questions/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send quiz email');
    console.log('[QuizEmail] Email sent successfully:', data);
    return data;
  } catch (err) {
    clearTimeout(timeout);
    console.error('[QuizEmail] send error:', err.message);
    throw err;
  }
};

// ── Get Recent Quizzes ────────────────────────────────────────────────────────
export const getRecentQuizzes = async (userEmail, userId = null, limit = 10) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (userEmail) params.append('userEmail', userEmail);
    params.append('limit', limit);

    const res = await fetch(`${BASE_URL}/quiz-questions/recent-quizzes?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch recent quizzes');
    console.log('[QuizHistory] Recent quizzes fetched:', data);
    return data;
  } catch (err) {
    console.error('[QuizHistory] fetch error:', err.message);
    throw err;
  }
};
