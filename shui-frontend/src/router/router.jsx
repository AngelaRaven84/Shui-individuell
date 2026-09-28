import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/homepage/HomePage';
import LoginPage from '../pages/loginpage/LoginPage';
import RegisterPage from '../pages/registerpage/RegisterPage';
import NewMessagePage from '../pages/newmessagepage/NewMessagePage';
import EditMessagePage from '../pages/editmessagepage/EditMessagePage';
import RequireLogin from './requireLogin';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '/message/create',
		element: (
			<RequireLogin>
				<NewMessagePage />
			</RequireLogin>
		),
	},
	{
		path: '/message/edit/:id',
		element: (
			<RequireLogin>
				<EditMessagePage />
			</RequireLogin>
		),
	},
]);
