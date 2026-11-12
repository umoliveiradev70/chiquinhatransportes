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
    signInWithEmail: (email, password) => auth.signInWithEmailAndPassword(email, password),
    signInWithEmailAndPassword: (email, password) => auth.signInWithEmailAndPassword(email, password),
    signUpWithEmail: async (email, password, displayName) => {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      if (displayName && cred.user && cred.user.updateProfile) {
        await cred.user.updateProfile({ displayName: displayName.trim() });
      }
      if (cred.user && cred.user.sendEmailVerification) {
        await cred.user.sendEmailVerification();
      }
      return cred;
    },
    sendEmailVerification: (user) => {
      const u = user || auth.currentUser;
      if (!u || !u.sendEmailVerification) throw new Error('Usuário não autenticado.');
      return u.sendEmailVerification();
    },
    reloadUser: async (user) => {
      const u = user || auth.currentUser;
      if (u && u.reload) await u.reload();
      return u;
    },
    createUserWithEmailAndPassword: (email, password) => auth.createUserWithEmailAndPassword(email, password),
    sendPasswordReset: (email) => auth.sendPasswordResetEmail(email),
    sendPasswordResetEmail: (email) => auth.sendPasswordResetEmail(email),
    applyActionCode: (code) => auth.applyActionCode(code),
    verifyPasswordResetCode: (code) => auth.verifyPasswordResetCode(code),
    confirmPasswordReset: (code, newPassword) => auth.confirmPasswordReset(code, newPassword),
    checkActionCode: (code) => auth.checkActionCode(code),
    updateUserProfile: async (data) => {
      if (!auth.currentUser) throw new Error('Usuário não autenticado.');
      return auth.currentUser.updateProfile(data);
    },
    updateUserPassword: async (newPassword) => {
      if (!auth.currentUser) throw new Error('Usuário não autenticado.');
      return auth.currentUser.updatePassword(newPassword);
    },
    signOut: () => auth.signOut(),
    onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback),
    getCurrentUser: () => auth.currentUser
  };
})();
