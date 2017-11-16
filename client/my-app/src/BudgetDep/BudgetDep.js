import React from 'react';
import cssModule from 'react-css-modules';
import styles from './BudgetDep.css';
import Request from 'superagent';
import _ from 'lodash';
import Pagination from '../Pagination/Pagination';

class BudgetDep extends React.Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			pageOfItems: []
		};
	}

	onChangePage(pageOfItems) {
		// update state with new page of items
		this.setState({ pageOfItems: pageOfItems });
	}

	getGroupRollup = function(niveau) {
		var url = niveau
			? 'http://localhost:3001/api/fait_activites/statBudgetDepAnne/' + niveau
			: 'http://localhost:3001/api/fait_activites/statBudgetDepAnne/';
		Request.get(url).then(res => {
			this.setState({ exampleItems: JSON.parse(res.text) });
		});
	};

	componentDidMount() {
		this.getGroupRollup();
		this.onChangePage = this.onChangePage.bind(this);
	}

	refresh = function(event) {
		this.getGroupRollup(event.target.value);
	};

	render() {
		var budgets = _.map(this.state.pageOfItems, budget => {
			var ret;
			if (!budget._id) {
				ret = (
					<tr className="sumTotal">
						<td>null</td>
						<td>null</td>
						<td>
							{budget.value.totalBudget}
						</td>
						<td>
							{budget.value.totalCout}
						</td>
					</tr>
				);
			} else {
				if (budget._id.libDep) {
					if (budget._id.annee) {
						ret = (
							<tr>
								<td>
									{budget._id.libDep}
								</td>
								<td>
									{budget._id.annee}
								</td>
								<td>
									{budget.value.totalBudget}
								</td>
								<td>
									{budget.value.totalCout}
								</td>
							</tr>
						);
					} else {
						ret = (
							<tr className="total">
								<td>
									{budget._id.libDep}
								</td>
								<td>null</td>
								<td>
									{budget.value.totalBudget}
								</td>
								<td>
									{budget.value.totalCout}
								</td>
							</tr>
						);
					}
				}
			}

			return ret;
		});

		var niveauSelect = [
			{ niveau: '' },
			{ niveau: 'Compétition départementale' },
			{ niveau: 'Loisir - Entretien - Remise en forme' },
			{ niveau: 'Entrainement' },
			{ niveau: 'Scolaire' },
			{ niveau: 'Compétition régionale' },
			{ niveau: 'Compétition nationale' },
			{ niveau: 'Non défini' },
			{ niveau: 'Compétition internationale' }
		];

		return (
			<div>
				<div>
					<h2>Budget dépensé par département pour les événements sportifs par année</h2>
					<h3>Possibilité de filtrer par niveau</h3>

					<div class="form-group">
						<label for="sel1">Selectioner un niveau:</label>
						<select
							onChange={e => {
								this.refresh(e);
							}}
							class="form-control"
						>
							{niveauSelect.map((value, index) => {
								return (
									<option value={value.niveau}>
										{value.niveau}
									</option>
								);
							})}
						</select>
					</div>
				</div>
				<div className="col-lg-12">
					<table className="table table-striped">
						<tbody>
							<tr>
								<th>Département</th>
								<th>Année</th>
								<th>Total budget</th>
								<th>Total cout</th>
							</tr>
							{budgets}
						</tbody>
					</table>
					<Pagination items={this.state.exampleItems} onChangePage={this.onChangePage} />
				</div>
			</div>
		);
	}
}

export default cssModule(BudgetDep, styles);