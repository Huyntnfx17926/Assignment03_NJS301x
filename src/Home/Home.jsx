import React, { useEffect, useState } from 'react';
import HistoryAPI from '../API/HistoryAPI';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

Home.propTypes = {};

function Home(props) {
	const [history, setHistory] = useState([]);

	useEffect(async () => {
		const response = await HistoryAPI.getAll();
		setHistory(response);
	}, []);

	return (
		<div className='page-wrapper'>
			<div className='page-breadcrumb'>
				<div className='row'>
					<div className='col-7 align-self-center'>
						{/* <h3 className='page-title text-truncate text-dark font-weight-medium mb-1'>
							Good Morning Jason!
						</h3> */}
						<div className='d-flex align-items-center'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb m-0 p-0'>
									<li className='breadcrumb-item'>
										<Link to='/'>Dashboard</Link>
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>
			</div>
			<div className='container-fluid'>
				<div className='card-group'>
					<div className='card border-right'>
						<div className='card-body'>
							<div className='d-flex d-lg-flex d-md-block align-items-center'>
								<div>
									<div className='d-inline-flex align-items-center'>
										<h2 className='text-dark mb-1 font-weight-medium'>
											2
										</h2>
									</div>
									<h6 className='text-muted font-weight-normal mb-0 w-100 text-truncate'>
										Clients
									</h6>
								</div>
								<div className='ml-auto mt-md-3 mt-lg-0'>
									<span className='opacity-7 text-muted'>
										<i data-feather='user-plus'></i>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='card border-right'>
						<div className='card-body'>
							<div className='d-flex d-lg-flex d-md-block align-items-center'>
								<div>
									<h2 className='text-dark mb-1 w-100 text-truncate font-weight-medium'>
										<sup className='set-doller'>$</sup>44779000
									</h2>
									<h6 className='text-muted font-weight-normal mb-0 w-100 text-truncate'>
										Earnings of Month
									</h6>
								</div>
								<div className='ml-auto mt-md-3 mt-lg-0'>
									<span className='opacity-7 text-muted'>
										<i data-feather='dollar-sign'></i>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className='card border-right'>
						<div className='card-body'>
							<div className='d-flex d-lg-flex d-md-block align-items-center'>
								<div>
									<div className='d-inline-flex align-items-center'>
										<h2 className='text-dark mb-1 font-weight-medium'>
											2
										</h2>
									</div>
									<h6 className='text-muted font-weight-normal mb-0 w-100 text-truncate'>
										New Order
									</h6>
								</div>
								<div className='ml-auto mt-md-3 mt-lg-0'>
									<span className='opacity-7 text-muted'>
										<i data-feather='file-plus'></i>
									</span>
								</div>
							</div>
						</div>
					</div>
					{/* <div className='card'>
						<div className='card-body'>
							<div className='d-flex d-lg-flex d-md-block align-items-center'>
								<div>
									<h2 className='text-dark mb-1 font-weight-medium'>
										10
									</h2>
									<h6 className='text-muted font-weight-normal mb-0 w-100 text-truncate'>
										Projects
									</h6>
								</div>
								<div className='ml-auto mt-md-3 mt-lg-0'>
									<span className='opacity-7 text-muted'>
										<i data-feather='globe'></i>
									</span>
								</div>
							</div>
						</div>
					</div> */}
				</div>
				{/* <div className='row'>
					<div className='col-12'>
						<div className='card'>
							<div className='card-body'>
								<div className='d-flex align-items-center mb-4'>
									<h4 className='card-title'>Top Leaders</h4>
									<div className='ml-auto'>
										<div className='dropdown sub-dropdown'>
											<button
												className='btn btn-link text-muted dropdown-toggle'
												type='button'
												id='dd1'
												data-toggle='dropdown'
												aria-haspopup='true'
												aria-expanded='false'>
												<i data-feather='more-vertical'></i>
											</button>
											<div
												className='dropdown-menu dropdown-menu-right'
												aria-labelledby='dd1'>
												<a className='dropdown-item' href='#'>
													Insert
												</a>
												<a className='dropdown-item' href='#'>
													Update
												</a>
												<a className='dropdown-item' href='#'>
													Delete
												</a>
											</div>
										</div>
									</div>
								</div>
								<div className='table-responsive'>
									<table className='table no-wrap v-middle mb-0'>
										<thead>
											<tr className='border-0'>
												<th className='border-0 font-14 font-weight-medium text-muted'>
													Team Lead
												</th>
												<th className='border-0 font-14 font-weight-medium text-muted px-2'>
													Project
												</th>
												<th className='border-0 font-14 font-weight-medium text-muted text-center'>
													Status
												</th>
												<th className='border-0 font-14 font-weight-medium text-muted text-center'>
													Weeks
												</th>
												<th className='border-0 font-14 font-weight-medium text-muted'>
													Budget
												</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className='border-top-0 px-2 py-4'>
													<div className='d-flex no-block align-items-center'>
														<div className='mr-3'>
															<img
																src='../assets/images/users/IMG_6225.jpg'
																alt='user'
																className='rounded-circle'
																width='45'
																height='45'
															/>
														</div>
														<div className=''>
															<h5 className='text-dark mb-0 font-16 font-weight-medium'>
																Nguyen Kim Tien
															</h5>
															<span className='text-muted font-14'>
																tienkim9920@gmail.com
															</span>
														</div>
													</div>
												</td>
												<td className='border-top-0 text-muted px-2 py-4 font-14'>
													Admin
												</td>

												<td className='border-top-0 text-center px-2 py-4'>
													<i
														className='fa fa-circle text-primary font-12'
														data-toggle='tooltip'
														data-placement='top'
														title='In Testing'></i>
												</td>
												<td className='border-top-0 text-center font-weight-medium text-muted px-2 py-4'>
													35
												</td>
												<td className='font-weight-medium text-dark border-top-0 px-2 py-4'>
													$99K
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div> */}
				<div className='row'>
					<div className='col-12'>
						<div className='card'>
							<div className='card-body'>
								<h4 className='card-title'>History</h4>
								<br />
								<div className='table-responsive'>
									<table className='table table-striped table-bordered no-wrap'>
										<thead>
											<tr>
												<th>ID User</th>
												<th>Name</th>
												<th>Phone</th>
												<th>Address</th>
												<th>Total</th>
												<th>Delivery</th>
												<th>Status</th>
												<th>Detail</th>
											</tr>
										</thead>
										<tbody>
											{history &&
												history.map((value) => (
													<tr key={value._id}>
														<td>{value.idUser}</td>
														<td>{value.fullname}</td>
														<td>{value.phone}</td>
														<td>{value.address}</td>
														<td>{value.total}</td>
														<td>
															{value.delivery
																? 'Đã Vận Chuyển'
																: 'Chưa Vận Chuyển'}
														</td>
														<td>
															{value.status
																? 'Đã Thanh Toán'
																: 'Chưa Thanh Toán'}
														</td>
														<td>
															<a
																style={{
																	cursor: 'pointer',
																	color: 'white',
																}}
																className='btn btn-success'>
																View
															</a>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className='footer text-center text-muted'>

			</footer>
		</div>
	);
}

export default Home;
