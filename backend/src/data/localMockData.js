// Local in-memory mock data — mirrors Firestore schema exactly.
// Used when USE_LOCAL_DATA=true or when Firestore is unavailable.

const JOURNEY_STAGES = [
  { index: 0, label: 'Eligibility Check', icon: 'shield-check', color: '#6366F1', description: 'Verify you meet the basic requirements to vote in India.', tips: 'You must be 18+ and an Indian citizen.' },
  { index: 1, label: 'Registration', icon: 'user-plus', color: '#3B82F6', description: 'Apply to be added to the Electoral Roll (voter list).', tips: 'Register online at voters.eci.gov.in or at your nearest BLO office.' },
  { index: 2, label: 'Roll Verification', icon: 'search', color: '#0EA5E9', description: 'Confirm your name appears correctly on the official voter list.', tips: 'Check online or at your local ERO office.' },
  { index: 3, label: 'Polling Day Prep', icon: 'clipboard-list', color: '#F97316', description: 'Get ready for election day — know your booth, carry valid ID.', tips: 'Download your voter slip and confirm the booth address.' },
  { index: 4, label: 'Voting', icon: 'vote', color: '#10B981', description: 'Cast your vote at your assigned polling booth on election day.', tips: 'Polling booths are open from 7 AM to 6 PM. Bring any valid photo ID.' },
  { index: 5, label: 'Counting & Results', icon: 'bar-chart', color: '#F59E0B', description: 'Votes are counted and results are declared by the Election Commission.', tips: 'Results are usually declared within 24–48 hours after voting ends.' },
];

const STATE_TIMELINES = {
  delhi: { state: 'delhi', stateName: 'Delhi', notificationDate: '2024-10-15', nominationDeadline: '2024-10-22', lastWithdrawal: '2024-10-25', pollDate: '2024-11-20', resultDate: '2024-11-23', pollProximityDays: 25 },
  maharashtra: { state: 'maharashtra', stateName: 'Maharashtra', notificationDate: '2024-10-01', nominationDeadline: '2024-10-08', lastWithdrawal: '2024-10-11', pollDate: '2024-11-05', resultDate: '2024-11-08', pollProximityDays: 10 },
  gujarat: { state: 'gujarat', stateName: 'Gujarat', notificationDate: '2024-11-01', nominationDeadline: '2024-11-08', lastWithdrawal: '2024-11-11', pollDate: '2024-12-05', resultDate: '2024-12-08', pollProximityDays: 40 },
  karnataka: { state: 'karnataka', stateName: 'Karnataka', notificationDate: '2024-09-20', nominationDeadline: '2024-09-27', lastWithdrawal: '2024-09-30', pollDate: '2024-10-28', resultDate: '2024-10-31', pollProximityDays: 5 },
  rajasthan: { state: 'rajasthan', stateName: 'Rajasthan', notificationDate: '2024-11-10', nominationDeadline: '2024-11-17', lastWithdrawal: '2024-11-20', pollDate: '2024-12-15', resultDate: '2024-12-18', pollProximityDays: 50 },
  up: { state: 'up', stateName: 'Uttar Pradesh', notificationDate: '2024-10-05', nominationDeadline: '2024-10-12', lastWithdrawal: '2024-10-15', pollDate: '2024-11-10', resultDate: '2024-11-13', pollProximityDays: 15 },
  tamilnadu: { state: 'tamilnadu', stateName: 'Tamil Nadu', notificationDate: '2024-09-01', nominationDeadline: '2024-09-08', lastWithdrawal: '2024-09-11', pollDate: '2024-10-10', resultDate: '2024-10-13', pollProximityDays: -5 },
  westbengal: { state: 'westbengal', stateName: 'West Bengal', notificationDate: '2024-11-20', nominationDeadline: '2024-11-27', lastWithdrawal: '2024-11-30', pollDate: '2024-12-25', resultDate: '2024-12-28', pollProximityDays: 60 },
  punjab: { state: 'punjab', stateName: 'Punjab', notificationDate: '2024-10-20', nominationDeadline: '2024-10-27', lastWithdrawal: '2024-10-30', pollDate: '2024-11-25', resultDate: '2024-11-28', pollProximityDays: 30 },
  andhrapradesh: { state: 'andhrapradesh', stateName: 'Andhra Pradesh', notificationDate: '2024-11-05', nominationDeadline: '2024-11-12', lastWithdrawal: '2024-11-15', pollDate: '2024-12-10', resultDate: '2024-12-13', pollProximityDays: 45 },
};

const MYTH_FACTS = [
  { id: 'mf001', myth: 'I can vote at any polling station in my city.', fact: 'You can only vote at the specific booth assigned to your registered address. Voting at another booth is not permitted.', category: 'voting-process' },
  { id: 'mf002', myth: 'I need to carry my Voter ID card to vote.', fact: 'You can use any of 12 approved photo IDs including Aadhaar, Passport, PAN card, Driving License, or MNREGA job card.', category: 'documents' },
  { id: 'mf003', myth: 'My vote is not secret — officials can see how I voted.', fact: 'Voting is completely secret. The EVM records no identity information. No one can trace how you voted.', category: 'security' },
  { id: 'mf004', myth: 'If I press the wrong button on the EVM, I can cancel it.', fact: 'Once you press a button on the EVM, your vote is recorded and cannot be cancelled. Choose carefully.', category: 'voting-process' },
  { id: 'mf005', myth: 'I cannot vote if my name has a minor spelling mistake in the voter list.', fact: 'Minor spelling errors do not disqualify you. Booth officers can verify your identity and allow you to vote.', category: 'eligibility' },
  { id: 'mf006', myth: 'NOTA means my vote is wasted.', fact: 'NOTA (None Of The Above) is a valid choice. It sends a message to political parties about voter dissatisfaction.', category: 'voting-process' },
  { id: 'mf007', myth: 'Voting takes a very long time and is complicated.', fact: 'The actual voting process takes only 2–5 minutes inside the booth. Most booths are well-organized with separate queues.', category: 'process' },
  { id: 'mf008', myth: 'I can be bribed to vote for a party without consequences.', fact: 'Accepting bribes for votes is a criminal offence under the Representation of the People Act, 1951.', category: 'legal' },
  { id: 'mf009', myth: 'Once registered, my voter ID is valid forever from any address.', fact: 'If you move to a new constituency, you must update your registration. Your old registration becomes invalid for voting in the new area.', category: 'registration' },
  { id: 'mf010', myth: 'NRIs cannot vote in Indian elections.', fact: 'NRIs who are Indian citizens can register as overseas voters and vote from their constituency of origin.', category: 'eligibility' },
  { id: 'mf011', myth: 'I need to take a holiday to vote — it is not paid leave.', fact: 'Election day is a public holiday for employees. Workers are allowed time off to vote.', category: 'process' },
  { id: 'mf012', myth: 'The VVPAT slip I see is my actual ballot paper.', fact: 'The VVPAT slip is only a visual confirmation record. It drops into a sealed box automatically. The EVM records your vote.', category: 'technology' },
];

const CHECKLIST_TEMPLATES = {
  first_time: {
    type: 'first_time', title: 'First-Time Voter Checklist',
    items: [
      { id: 1, task: 'Confirm you are 18+ years old', priority: 'high' },
      { id: 2, task: 'Register on the Electoral Roll (Form 6)', priority: 'high' },
      { id: 3, task: 'Verify your name appears on the voter list', priority: 'high' },
      { id: 4, task: 'Download or collect your Voter ID / EPIC card', priority: 'medium' },
      { id: 5, task: 'Find your assigned polling booth', priority: 'medium' },
      { id: 6, task: 'Prepare any accepted photo ID to carry', priority: 'medium' },
      { id: 7, task: 'Learn about the candidates and parties', priority: 'low' },
      { id: 8, task: 'Plan your travel to the polling booth', priority: 'low' },
    ],
  },
  registered: {
    type: 'registered', title: 'Already Registered Voter Checklist',
    items: [
      { id: 1, task: 'Verify your name is still on the current voter list', priority: 'high' },
      { id: 2, task: 'Confirm your polling booth address (it may have changed)', priority: 'high' },
      { id: 3, task: 'Download your voter slip from the ECI website', priority: 'medium' },
      { id: 4, task: 'Check the election date and polling hours for your area', priority: 'medium' },
      { id: 5, task: 'Carry a valid photo ID on voting day', priority: 'high' },
      { id: 6, task: 'Update address if you have moved to a new constituency', priority: 'medium' },
    ],
  },
  polling_day: {
    type: 'polling_day', title: 'Polling Day Checklist',
    items: [
      { id: 1, task: 'Carry your voter slip or EPIC card', priority: 'high' },
      { id: 2, task: 'Carry a valid photo ID (Aadhaar / Passport / PAN)', priority: 'high' },
      { id: 3, task: 'Arrive at your designated polling booth', priority: 'high' },
      { id: 4, task: 'Join the correct queue (separate for men/women/senior citizens)', priority: 'medium' },
      { id: 5, task: 'Get your finger marked with indelible ink', priority: 'high' },
      { id: 6, task: 'Press the button for your chosen candidate on the EVM', priority: 'high' },
      { id: 7, task: 'Verify the VVPAT slip shows your choice (7 seconds)', priority: 'medium' },
      { id: 8, task: 'Exit the booth calmly — your vote is cast!', priority: 'low' },
    ],
  },
};

const BOOTHS = [
  { boothId: 'DL001', name: 'Govt. Sarvodaya Bal Vidyalaya', address: '12, Pusa Road, Karol Bagh, New Delhi - 110005', district: 'central delhi', state: 'delhi', pincode: '110005', distance: '1.2 km', travelTime: '5 min walk', lat: 28.6517, lng: 77.1908 },
  { boothId: 'DL002', name: 'MCD Primary School, Rajinder Nagar', address: '45, Rajinder Nagar, New Delhi - 110060', district: 'west delhi', state: 'delhi', pincode: '110060', distance: '0.8 km', travelTime: '3 min walk', lat: 28.6394, lng: 77.1751 },
  { boothId: 'MH001', name: 'BMC Ward Office, Andheri', address: 'Andheri (West), Mumbai - 400058', district: 'mumbai suburban', state: 'maharashtra', pincode: '400058', distance: '2.1 km', travelTime: '8 min auto', lat: 19.1197, lng: 72.8468 },
  { boothId: 'MH002', name: 'Pune Municipal Booth No. 14', address: 'Shivajinagar, Pune - 411005', district: 'pune', state: 'maharashtra', pincode: '411005', distance: '1.5 km', travelTime: '6 min walk', lat: 18.5304, lng: 73.8467 },
  { boothId: 'KA001', name: 'BBMP Booth, Indiranagar', address: '100 Feet Road, Indiranagar, Bengaluru - 560038', district: 'bangalore urban', state: 'karnataka', pincode: '560038', distance: '1.8 km', travelTime: '7 min walk', lat: 12.9784, lng: 77.6408 },
  { boothId: 'GJ001', name: 'AMC Primary School, Navrangpura', address: 'Navrangpura, Ahmedabad - 380009', district: 'ahmedabad', state: 'gujarat', pincode: '380009', distance: '2.5 km', travelTime: '10 min auto', lat: 23.0225, lng: 72.5714 },
  { boothId: 'UP001', name: 'Panchayat Bhavan, Gomti Nagar', address: 'Gomti Nagar, Lucknow - 226010', district: 'lucknow', state: 'up', pincode: '226010', distance: '3.0 km', travelTime: '12 min auto', lat: 26.8467, lng: 80.9462 },
  { boothId: 'RJ001', name: 'Govt School, C-Scheme', address: 'C-Scheme, Jaipur - 302001', district: 'jaipur', state: 'rajasthan', pincode: '302001', distance: '1.0 km', travelTime: '4 min walk', lat: 26.9124, lng: 75.7873 },
  { boothId: 'TN001', name: 'Corporation Booth, T. Nagar', address: 'T. Nagar, Chennai - 600017', district: 'chennai', state: 'tamilnadu', pincode: '600017', distance: '0.6 km', travelTime: '2 min walk', lat: 13.0418, lng: 80.2341 },
  { boothId: 'WB001', name: 'Ward Office, Salt Lake', address: 'Sector V, Salt Lake, Kolkata - 700091', district: 'kolkata', state: 'westbengal', pincode: '700091', distance: '2.2 km', travelTime: '9 min auto', lat: 22.5726, lng: 88.4298 },
  { boothId: 'PB001', name: 'Govt School, Sector 22', address: 'Sector 22, Chandigarh - 160022', district: 'chandigarh', state: 'punjab', pincode: '160022', distance: '1.4 km', travelTime: '5 min walk', lat: 30.7333, lng: 76.7794 },
  { boothId: 'AP001', name: 'Municipal Office, Vijayawada', address: 'MG Road, Vijayawada - 520001', district: 'krishna', state: 'andhrapradesh', pincode: '520001', distance: '1.7 km', travelTime: '7 min auto', lat: 16.5062, lng: 80.6480 },
];

const VOTING_SIMULATION = {
  steps: [
    { step: 1, title: 'Enter the Polling Booth', description: 'Present your voter slip and any valid photo ID to the Presiding Officer at the entrance. Your name is verified against the electoral roll.', icon: 'door-open', tip: 'Senior citizens and persons with disability have separate priority queues.' },
    { step: 2, title: 'Get Indelible Ink Mark', description: 'A Polling Officer applies indelible blue-black ink on the index finger of your left hand. This prevents double voting.', icon: 'fingerprint', tip: 'The ink is specially formulated to last 2–3 weeks and cannot be washed off easily.' },
    { step: 3, title: 'Receive the Ballot Slip', description: 'Sign the register and receive a ballot number slip. You are then directed to the voting compartment for privacy.', icon: 'file-text', tip: 'The voting compartment ensures complete secrecy of your vote.' },
    { step: 4, title: 'Press the EVM Button', description: 'Inside the compartment, you will see the Electronic Voting Machine (EVM) with candidate names and party symbols. Press the blue button next to your chosen candidate.', icon: 'mouse-pointer', tip: 'A beep sound confirms your vote is registered. Take your time — there is no rush.' },
    { step: 5, title: 'Verify on VVPAT', description: 'The Voter Verifiable Paper Audit Trail (VVPAT) machine displays a printed slip with the candidate name and symbol for 7 seconds, then drops it into a sealed box.', icon: 'check-square', tip: 'This paper trail allows for verification in case of disputes. You cannot take the slip with you.' },
    { step: 6, title: 'Exit the Booth', description: 'Your vote is successfully cast! Exit the polling booth calmly. You may display your inked finger proudly — it is a symbol of democratic participation.', icon: 'log-out', tip: 'Exit polls are sometimes conducted outside. Participation is voluntary.' },
  ],
};

// ── Query helpers (same API as firestoreService) ────────────────────────────

function getDoc(collection, docId) {
  switch (collection) {
    case 'journeyStages': return JOURNEY_STAGES.find(s => `stage_${s.index}` === docId) || null;
    case 'stateTimelines': return STATE_TIMELINES[docId] || null;
    case 'checklistTemplates': return CHECKLIST_TEMPLATES[docId] || null;
    case 'votingSimulation': return docId === 'votingSteps' ? VOTING_SIMULATION : null;
    default: return null;
  }
}

function getCollection(collection, filters = []) {
  let data = [];
  switch (collection) {
    case 'journeyStages': data = JOURNEY_STAGES; break;
    case 'stateTimelines': data = Object.values(STATE_TIMELINES); break;
    case 'mythFacts': data = MYTH_FACTS; break;
    case 'checklistTemplates': data = Object.values(CHECKLIST_TEMPLATES); break;
    case 'booths': data = BOOTHS; break;
    default: data = [];
  }
  // Apply filters
  for (const [field, op, val] of filters) {
    if (op === '==') data = data.filter(d => d[field] === val);
  }
  return data;
}

module.exports = { getDoc, getCollection };
