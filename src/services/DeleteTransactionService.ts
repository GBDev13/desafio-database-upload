import { getCustomRepository } from "typeorm";

import AppError from '../errors/AppError';

import Transaction from "../models/Transaction";

import TransactionsRepository from "../repositories/TransactionsRepository";

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // Busca, existe? Não existe? Erro
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError("Transaction does not exist");
    }

    await transactionsRepository.remove(transaction)
  }
}

export default DeleteTransactionService;
