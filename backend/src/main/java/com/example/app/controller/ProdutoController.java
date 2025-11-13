package com.example.app.controller;

import com.example.app.model.Produto;
import com.example.app.repository.ProdutoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        List<Produto> produtos = repository.findAll();
        return ResponseEntity.ok(produtos);
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<Produto> opt = repository.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Produto não encontrado");
        }

        return ResponseEntity.ok(opt.get());
    }

    // CRIAR
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Produto produto) {
        Produto salvo = repository.save(produto);
        URI location = URI.create("/api/v1/produtos/" + salvo.getId());
        return ResponseEntity.created(location).body(salvo);
    }

    // ATUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @RequestBody Produto atualizacao) {

        Optional<Produto> opt = repository.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Produto não encontrado");
        }

        Produto existente = opt.get();

        // copia todos os campos de "atualizacao" para "existente", menos o id
        BeanUtils.copyProperties(atualizacao, existente, "id");

        Produto salvo = repository.save(existente);
        return ResponseEntity.ok(salvo);
    }

    // DELETAR
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
