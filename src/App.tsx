import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './stores/StoreContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateEditRecipePage from './pages/CreateEditRecipePage';
import MyRecipesPage from './pages/MyRecipesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-recipes" 
            element={
              <ProtectedRoute>
                <MyRecipesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* ВАЖНО: /recipe/create должен быть ВЫШЕ /recipe/:id */}
          <Route 
            path="/recipe/create" 
            element={
              <ProtectedRoute>
                <CreateEditRecipePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/recipe/edit/:id" 
            element={
              <ProtectedRoute>
                <CreateEditRecipePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Динамический роут должен быть последним */}
          <Route 
            path="/recipe/:id" 
            element={
              <ProtectedRoute>
                <RecipeDetailPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
