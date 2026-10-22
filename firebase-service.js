(function () {
  const config = window.CQ_FIREBASE_CONFIG || {};
  const isConfigured = config.apiKey && !config.apiKey.startsWith('COLOQUE_') && config.projectId && config.projectId !== 'SEU_PROJETO';

  if (!isConfigured) {
    window.cqFirebase = { configured: false };
    return;
  }

  firebase.initializeApp(config);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const provider = new firebase.auth.GoogleAuthProvider();

  window.cqFirebase = {
    configured: true,
    auth,
    db,
    serverTimestamp: () => firebase.firestore.FieldValue.serverTimestamp(),
    signInWithGoogle: () => auth.signInWithPopup(provider),
    signOut: () => auth.signOut(),
    onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback)
  };
})();
