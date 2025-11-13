package com.example.app.controller;

import com.example.app.model.Produto;
import com.example.app.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Produto não encontrado"));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Produto produto) {
        Produto salvo = repository.save(produto);
        return ResponseEntity
                .created(URI.create("/api/v1/produtos/" + salvo.getId()))
                .body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Produto atualizacao) {

        return repository.findById(id)
                .map(produto -> {
                    produto.setNome(atualizacao.getNome());
                    produto.setPreco(atualizacao.getPreco());
                    produto.setDescricao(atualizacao.getDescricao());
                    Produto salvo = repository.save(produto);
                    return ResponseEntity.ok(salvo);
                })
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Produto não encontrado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Produto não encontrado");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
