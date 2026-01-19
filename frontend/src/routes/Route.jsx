import React, { useContext } from "react";
import { Route as RouterRoute, Redirect } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";

const Route = ({ component: Component, isPrivate = false, ...rest }) => {
	const { isAuth, loading, user } = useContext(AuthContext);

	// Verificar se a empresa está vencida
	const isCompanyExpired = () => {
		if (!user || !user.company || user.company.id === 1) {
			return false; // Empresa ID 1 nunca expira
		}

		const dueDate = user.company.dueDate;
		if (!dueDate) return false;

		// Comparar apenas as datas (sem horas) para permitir acesso até 23h59 do dia do vencimento
		const hojeInicio = moment().startOf('day');
		const vencimentoInicio = moment(dueDate).startOf('day');
		
		// Empresa está vencida apenas após o dia do vencimento
		return hojeInicio.isAfter(vencimentoInicio, 'day');
	};

	if (!isAuth && isPrivate) {
		return (
			<>
				{loading && <BackdropLoading />}
				<Redirect to={{ pathname: "/login", state: { from: rest.location } }} />
			</>
		);
	}

	if (isAuth && !isPrivate) {
		return (
			<>
				{loading && <BackdropLoading />}
				<Redirect to={{ pathname: "/", state: { from: rest.location } }} />;
			</>
		);
	}

	// Se está autenticado e a empresa está vencida
	if (isAuth && isPrivate && isCompanyExpired()) {
		// Permite acesso apenas ao /financeiro-aberto
		if (rest.path !== "/financeiro-aberto") {
			return (
				<>
					{loading && <BackdropLoading />}
					<Redirect to={{ pathname: "/financeiro-aberto", state: { from: rest.location } }} />
				</>
			);
		}
	}

	return (
		<>
			{loading && <BackdropLoading />}
			<RouterRoute {...rest} component={Component} />
		</>
	);
};

export default Route;
